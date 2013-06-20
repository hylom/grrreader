#-*- coding: utf-8 -*-
'fetcher.py - RSS fetcher'

import re

import feedparser
import dateutil.parser
from config import config as config
from logger import log

def _get_attr(obj, attr, default=""):
    try:
        return obj.__getattr__(attr)
    except AttributeError:
        return default

class FeedFetcher(object):
    'Feed fetching and parsing'
    def __init__(self, feed):
        self._feed = feed

    def _fetch(self):
        'do fetch'
        f = feedparser.parse(self._feed["source"])
        entries = []
        for e in f['entries']:

            entry = {
                'feed': self._feed,
                'tags': [],
                }
            entry["title"] = _get_attr(e, "title", "(no title)")
            entry["url"] = _get_attr(e, "link")
            entry["body"] = _get_attr(e, "description")
            entry["date"] = _get_attr(e, "updated", None)

            if entry["date"] == None:
                entry["date"] = _get_attr(e, "published", None)

            if entry["date"] == None:
                continue

            entry["date"] = dateutil.parser.parse(entry["date"])
            if entry['date'].tzinfo == None:
                entry['date'] = entry['date'].replace(tzinfo=dateutil.tz.tzutc())

            entries.append(entry)
        return entries

    def _embeded_filter(self, entry):
        # remove PR entry
        if re.search(u'^(PR|AD)(:|：)', entry['title']):
            log('delete PR entry - %s' % entry['title'])
            return None
        return entry

    def _apply_filters(self, filters, entries):
        for f in filters:
            entry_filter = self._get_filter(f)
            entries = [entry_filter(x) for x in entries]
            # remove entry which is None
            entries = [x for x in entries if x]
        return entries

    def _apply_pre_filters(self, entries):
        return self._apply_filters(config['pre_filters'], entries)

    def _apply_post_filters(self, entries):
        return self._apply_filters(config['post_filters'], entries)

    def get_entries(self):
        'get entries'
        entries = self._fetch()
        entries = self._apply_pre_filters(entries)

        if 'filters' in self._feed:
            filters = self._feed.get('filters', None)
            entries = self._apply_filters(filters, entries)

        entries = self._apply_post_filters(entries)
        return entries

    def _get_filter(self, filter_name):
        'load filter by seed settings'

        # fallback when filter isn't defined
        if filter_name is None:
            return lambda x:x
        
        # import module
        mods = __import__(config['filter_directory'], 
                          globals(),
                          locals(),
                          [filter_name,])
        try:
            mod = mods.__getattribute__(filter_name)
        except AttributeError:
            raise FilterError(filter_name)

        # return module's entry_filter function
        return mod.entry_filter
        
class FilterError(Exception):
    def __init__(self, value):
        self.value = value
    def __str__(self):
        return 'filter "' + self.value + '" is not found.'
