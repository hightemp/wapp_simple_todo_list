<?php

ini_set('display_errors', 1);

include_once("./config.php");
include_once("rb.php");

use RedBeanPHP\Logger as Logger;

// Config::fnLoad();

define('T_CATEGORIES', 'tcategories');
define('T_TASKS', 'ttasks');

define('T_TAGS', 'ttags');
define('T_TAGS_TO_OBJECTS', 'ttagstoobjectss');

if (Config::$aOptions["database"]["schema"] == "sqlite") {
    R::setup('sqlite:./db/dbfile.db');
} else {
    R::setup('mysql:host=localhost;dbname=mydatabase', 'user', 'password' );
}

if(!R::testConnection()) die('No DB connection!');

class MigrationLogger implements Logger {

    private $file;

    public function __construct( $file ) {
        $this->file = $file;
    }

    public function log() {
        $query = func_get_arg(0);
        if (preg_match( '/^(CREATE|ALTER)/', $query )) {
            file_put_contents( $this->file, "{$query};\n",  FILE_APPEND );
        }
    }
}

$ml = new MigrationLogger( sprintf( __DIR__.'/sql/migration_%s.sql', date('Y_m_d__H_i_s') ) );

R::getDatabaseAdapter()
    ->getDatabase()
    ->setLogger($ml)
    ->setEnableLogging(TRUE);