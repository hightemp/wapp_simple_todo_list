<?php 

include_once("./database.php");

if ($argv[1] == "nuke") {
    R::nuke();
    die();
}

if ($argv[1] == "truncate_category") {
    R::wipe(T_CATEGORIES);
    die();
}

if ($argv[1] == "list_tables") {
    $listOfTables = R::inspect();
    die(json_encode($listOfTables));
}

if ($argv[1] == "list_fields") {
    $fields = R::inspect($argv[2]);
    die(json_encode($fields));
}

if ($argv[1] == "add_fields") {
    $oTask = R::dispense(T_TASKS);

    $oTask->sort = 0;
    $oTask->status = 0;
    $oTask->priority = 0;
    $oTask->until_date = time();

    R::store($oTask);

    R::trashBatch(T_TASKS, [$oTask->id]);
}

if ($argv[1] == "create_scheme") {
    R::nuke();

    $oCategory = R::dispense(T_CATEGORIES);

    $oCategory->name = 'Тестовая категория';
    $oCategory->description = 'Тестовая категория';

    $oCategory2 = R::dispense(T_CATEGORIES);
    $oCategory2->name = 'Тестовая категория 2';
    $oCategory2->description = 'Тестовая категория 2';
    // R::store($oCategory2);

    $oCategory->tcategories = $oCategory2;

    R::store($oCategory);


    $oTask = R::dispense(T_TASKS);

    $oTask->created_at = date("Y-m-d H:i:s");
    $oTask->updated_at = date("Y-m-d H:i:s");
    $oTask->timestamp = time();
    $oTask->name = 'Тестовая заметка';
    $oTask->description = 'Тестовая заметка';

    $oTask2 = R::dispense(T_TASKS);

    $oTask2->created_at = date("Y-m-d H:i:s");
    $oTask2->updated_at = date("Y-m-d H:i:s");
    $oTask2->timestamp = time();
    $oTask2->name = 'Тестовая заметка';
    $oTask2->description = 'Тестовая заметка';

    $oTask->ttasks = $oTask2;
    $oTask->tcategories = $oCategory;

    R::store($oTask2);
    R::store($oTask);


    $oTag = R::dispense(T_TAGS);

    $oTag->created_at = date("Y-m-d H:i:s");
    $oTag->updated_at = date("Y-m-d H:i:s");
    $oTag->timestamp = time();
    $oTag->name = 'Тестовый тэг';

    R::store($oTag);

    $oTagToObjects = R::dispense(T_TAGS_TO_OBJECTS);

    $oTagToObjects->ttags = $oTag;
    $oTagToObjects->content_id = $oNote->id;
    $oTagToObjects->content_type = 'tnotes';
    $oTagToObjects->poly('contentType');

    R::store($oTagToObjects);

    R::trashBatch(T_TASKS, [$oTask->id]);
    R::trashBatch(T_TASKS, [$oTask2->id]);
    R::trashBatch(T_CATEGORIES, [$oCategory->id]);
    R::trashBatch(T_CATEGORIES, [$oCategory2->id]);
    R::trashBatch(T_TAGS, [$oTag->id]);
    R::trashBatch(T_TAGS_TO_OBJECTS, [$oTagToObjects->id]);

    die(json_encode([]));
}

function fnBuildRecursiveCategoriesTree(&$aResult, $aCategories) 
{
    $aResult = [];

    foreach ($aCategories as $oCategory) {
        $aTreeChildren = [];

        $aChildren = R::children($oCategory, " id != {$oCategory->id}");
        fnBuildRecursiveCategoriesTree($aTreeChildren, $aChildren);

        $aResult[] = [
            'id' => $oCategory->id,
            'text' => $oCategory->name,
            'children' => $aTreeChildren,
            'notes_count' => $oCategory->countOwn(T_TASKS)
        ];
    }
}

