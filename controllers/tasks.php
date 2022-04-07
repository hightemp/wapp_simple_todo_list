<?php

function fnBuildRecursiveTasksTree(&$aResult, $aTasks, $sSQL = "", $aBindings=[]) 
{
    $aResult = [];

    foreach ($aTasks as $oTask) {
        $aTreeChildren = [];

        $aChildren = R::findAll(T_TASKS, " ttasks_id = {$oTask->id} {$sSQL}", $aBindings);
        fnBuildRecursiveTasksTree($aTreeChildren, $aChildren, $sSQL, $aBindings);

        $aResult[] = [
            'id' => $oTask->id,
            'text' => $oTask->name,
            'created_at' => $oTask->created_at,
            'is_ready' => $oTask->is_ready,
            'name' => $oTask->name,
            'description' => $oTask->name,
            'category_id' => $oTask->tcategories_id,
            'task_id' => $oTask->ttasks_id,
            'children' => $aTreeChildren,
            'notes_count' => $oTask->countOwn(T_TASKS)
        ];
    }
}

if ($sMethod == 'list_tree_tasks') {
    $aTasks = R::findAll(T_TASKS, 'ttasks_id IS NULL AND tcategories_id = ? ORDER BY id DESC', [$aRequest['category_id']]);
    $aResult = [];

    fnBuildRecursiveTasksTree($aResult, $aTasks);

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

function fnBuildRecursiveTasksTreeDelete($oTask) 
{
    $aChildren = R::findAll(T_TASKS, " ttasks_id = {$oTask->id}");

    foreach ($aChildren as $oChildTask) {
        fnBuildRecursiveTasksTreeDelete($oChildTask);
        R::trashBatch(T_TASKS, [$oChildTask->id]);
    }
}

if ($sMethod == 'delete_task') {
    $oTask = R::findOne(T_TASKS, "id = ?", [$aRequest['id']]);

    fnBuildRecursiveTasksTreeDelete($oTask);

    R::trashBatch(T_TASKS, [$aRequest['id']]);
    die(json_encode([]));
}

if ($sMethod == 'update_task') {
    $oTask = R::findOne(T_TASKS, "id = ?", [$aRequest['id']]);

    $oTask->updated_at = date("Y-m-d H:i:s");
    $oTask->name = $aRequest['name'];
    $oTask->description = $aRequest['description'];
    $oTask->tcategories = R::findOne(T_CATEGORIES, "id = ?", [$aRequest['category_id']]);
    $oTask->ttasks = R::findOne(T_TASKS, "id = ?", [$aRequest['task_id']]);

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
    $oTask->ttasks = R::findOne(T_TASKS, "id = ?", [$aRequest['task_id']]);

    R::store($oTask);

    die(json_encode([
        "id" => $oTask->id, 
        "text" => $oTask->text
    ]));
}

function fnBuildRecursiveTasksTreeModify($oTask, $bIsReady) 
{
    $aChildren = R::findAll(T_TASKS, " ttasks_id = {$oTask->id}");

    foreach ($aChildren as $oChildTask) {
        $oChildTask->is_ready = $bIsReady;
        R::store($oChildTask);

        fnBuildRecursiveTasksTreeModify($oChildTask, $bIsReady);
    }
}

if ($sMethod == 'check_task') {
    $oTask = R::findOne(T_TASKS, "id = ?", [$aRequest['id']]);

    $oTask->is_ready = 1;
    $oTask->ttasks = NULL;

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
    $oTask->ttasks = NULL;

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