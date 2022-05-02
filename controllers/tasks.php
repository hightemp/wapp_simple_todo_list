<?php

if ($sMethod == 'list_tree_tasks') {
    $aResult = [];

    if (isset($aRequest['category_id']) && $aRequest['category_id']>0) {
        $aTasks = R::findAll(T_TASKS, 'ttasks_id IS NULL AND tcategories_id = ? ORDER BY id DESC', [$aRequest['category_id']]);
        fnBuildRecursiveTasksTree($aResult, $aTasks);
    } else {
        $aTasks = R::findAll(T_TASKS, 'ORDER BY id DESC', []);
        fnBuildTasksList($aResult, $aTasks);
    }

    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'list_last_undone_tasks') {
    $aTasks = R::findAll(T_TASKS, "ttasks_id IS NULL AND tcategories_id = ? AND is_ready = ? ORDER BY id DESC", [$aRequest['category_id'], 0]);
    fnBuildRecursiveTasksTree($aResult, $aTasks);

    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'list_last_done_tasks') {
    $aTasks = R::findAll(T_TASKS, "ttasks_id IS NULL AND tcategories_id = ? AND is_ready = ? ORDER BY id DESC", [$aRequest['category_id'], 1]);
    fnBuildRecursiveTasksTree($aResult, $aTasks);

    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'delete_task') {
    $oTask = R::findOne(T_TASKS, "id = ?", [$aRequest['id']]);

    fnBuildRecursiveTasksTreeDelete($oTask);

    die(json_encode([]));
}

if ($sMethod == 'update_task') {
    $oTask = R::findOne(T_TASKS, "id = ?", [$aRequest['id']]);

    $oTask->updated_at = date("Y-m-d H:i:s");
    $oTask->name = $aRequest['name'];
    $oTask->description = $aRequest['description'];
    $oTask->tcategories = R::findOne(T_CATEGORIES, "id = ?", [$aRequest['category_id']]);
    
    if ($oTask->ttasks_id == $oTask->id) {
        $oTask->ttasks_id = null;
    }

    if ($aRequest['task_id'] != $oTask->id) {
        $oTask->ttasks = R::findOne(T_TASKS, "id = ?", [$aRequest['task_id']]);
    }

    fnBuildRecursiveTasksTreeModifyCategory($oTask, $aRequest['category_id']);

    R::store($oTask);

    die(json_encode([
        "id" => $oTask->id, 
        "text" => $oTask->text
    ]));
}

if ($sMethod == 'create_task') {    
    $oTask = R::dispense(T_TASKS);

    $oTask->created_at = date("Y-m-d H:i:s");
    $oTask->updated_at = date("Y-m-d H:i:s");
    $oTask->timestamp = time();
    $oTask->name = $aRequest['name'];
    $oTask->description = $aRequest['description'];
    $oTask->is_ready = false;
    $oTask->tcategories = R::findOne(T_CATEGORIES, "id = ?", [$aRequest['category_id']]);

    if ($oTask->ttasks_id == $oTask->id) {
        $oTask->ttasks_id = null;
    }

    if ($aRequest['task_id'] != $oTask->id) {
        $oTask->ttasks = R::findOne(T_TASKS, "id = ?", [$aRequest['task_id']]);
    }

    if ($oTask->ttasks_id) {
        // $oTask->ttasks->is_ready = 0;
        fnBuildRecursiveTasksParentsUncheck($oTask);
    }

    R::store($oTask);

    die(json_encode([
        "id" => $oTask->id, 
        "text" => $oTask->text
    ]));
}

if ($sMethod == 'check_task') {
    $oTask = R::findOne(T_TASKS, "id = ?", [$aRequest['id']]);

    $oTask->is_ready = 1;

    fnBuildRecursiveTasksTreeModify($oTask, 1);

    R::store($oTask);

    die(json_encode([
        "id" => $oTask->id, 
        "text" => $oTask->text
    ]));
}

if ($sMethod == 'uncheck_task') {    
    $oTask = R::findOne(T_TASKS, "id = ?", [$aRequest['id']]);

    $oTask->is_ready = 0;

    if ($oTask->ttasks) {
        // $oTask->ttasks->is_ready = 0;
        fnBuildRecursiveTasksParentsUncheck($oTask);
    }

    fnBuildRecursiveTasksTreeModify($oTask, 0);

    R::store($oTask);

    die(json_encode([
        "id" => $oTask->id, 
        "text" => $oTask->text
    ]));
}

if ($sMethod == 'move_to_root_task') {
    $oTask = R::findOne(T_TASKS, "id = ?", [$aRequest['id']]);

    $oTask->ttasks = NULL;

    R::store($oTask);

    die(json_encode([
        "id" => $oTask->id, 
        "text" => $oTask->text
    ]));
}