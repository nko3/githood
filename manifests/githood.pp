
exec { 'aptitude-update' :
  command => '/usr/bin/aptitude update',
  logoutput => 'on_failure',
}

Package {
  provider => 'aptitude',
  require => Exec['aptitude-update'],
}

package { 'build-essential':
  ensure => present,
}

$nodeVersion = '0.8.14'

exec { 'download-nodejs':
  cwd => '/opt',
  command => "/usr/bin/wget http://nodejs.org/dist/v${nodeVersion}/node-v${nodeVersion}.tar.gz && tar xzf node-v${nodeVersion}.tar.gz",
  creates => "/opt/node-v${nodeVersion}",
}

exec { 'install-nodejs':
  cwd => "/opt/node-v${nodeVersion}",
  command => "/opt/node-v${nodeVersion}/configure && /usr/bin/make && /usr/bin/make install",
  creates => '/usr/local/bin/node',
  require => Exec['download-nodejs'],
}

