# grreader.spec

Summary: HTML-Based RSS Reader inspired by widely known discontinued reader
URL: http://hylom.net/grrreader
Name: grrreader
Version: 0.0.5
Group: Applications/Internet
Release: 1
License: GPLv2
Source0: http://hylom.net/%{name}-%{version}.tar.gz
BuildRoot: %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)
BuildArch: noarch

Requires: nodejs >= 0.10.0
Requires: python >= 2.6.6
Requires: python-dateutil >= 1.4.1
Requires: python-feedparser >= 5.1.2

%description
Grrreader is HTML and Ajax based RSS Reader application based on Node.js and Python.

%prep
%setup

%build

%install
mkdir -p ${RPM_BUILD_ROOT}%{_datadir}/grrreader

