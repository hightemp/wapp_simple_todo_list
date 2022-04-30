<?php

function fnBuildRecursiveCategoriesTree(&$aResult, $aCategories) 
{
    $aResult = [];

    foreach ($aCategories as $oCategory) {
        $aTreeChildren = [];

        $aChildren = R::findAll(T_CATEGORIES, " tcategories_id = {$oCategory->id}");
        fnBuildRecursiveCategoriesTree($aTreeChildren, $aChildren);

        $aResult[] = [
            'id' => $oCategory->id,
            'text' => $oCategory->name,
            'name' => $oCategory->name,
            'description' => $oCategory->description,
            'category_id' => $oCategory->tcategories_id,
            'children' => $aTreeChildren,
            'notes_count' => $oCategory->countOwn(T_TASKS)
        ];
    }
}

function fnBuildRecursiveTasksTree(&$aResult, $aTasks, $sSQL = "", $aBindings=[]) 
{
    $aResult = [];

    foreach ($aTasks as $oTask) {
        $aTreeChildren = [];

        $aChildren = R::findAll(T_TASKS, " ttasks_id = {$oTask->id} {$sSQL}", $aBindings);
        fnBuildRecursiveTasksTree($aTreeChildren, $aChildren, $sSQL, $aBindings);
        $iC = $oTask->countOwn(T_TASKS);

        $aResult[] = [
            'id' => $oTask->id,
            'text' => $oTask->name,
            'created_at' => $oTask->created_at,
            'is_ready' => $oTask->is_ready,
            'name' => $oTask->name,
            'description' => $oTask->description,
            'category_id' => $oTask->tcategories_id,
            'task_id' => $oTask->ttasks_id,
            'children' => $aTreeChildren,
            'notes_count' => $iC,
            'checked' => $oTask->is_ready == '1',
            // 'state' => $iC > 0 ? "closed" : "",
        ];
    }
}

function fnBuildTasksList(&$aResult, $aTasks, $sSQL = "", $aBindings=[]) 
{
    $aResult = [];

    foreach ($aTasks as $oTask) {
        $iC = $oTask->countOwn(T_TASKS);

        $aResult[] = [
            'id' => $oTask->id,
            'text' => $oTask->name,
            'created_at' => $oTask->created_at,
            'is_ready' => $oTask->is_ready,
            'name' => $oTask->name,
            'description' => $oTask->description,
            'category_id' => $oTask->tcategories_id,
            'task_id' => $oTask->ttasks_id,
            'notes_count' => $iC,
            'checked' => $oTask->is_ready == '1',
        ];
    }
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

function fnBuildRecursiveTasksTreeModifyCategory($oTask, $iCategoryID) 
{
    $aChildren = R::findAll(T_TASKS, " ttasks_id = {$oTask->id}");

    foreach ($aChildren as $oChildTask) {
        $oChildTask->tcategories_id = $iCategoryID;
        R::store($oChildTask);

        fnBuildRecursiveTasksTreeModify($oChildTask, $iCategoryID);
    }
}

function fnBuildRecursiveTasksTreeDelete($oTask) 
{
    $aChildren = R::findAll(T_TASKS, " ttasks_id = {$oTask->id}");

    foreach ($aChildren as $oChildTask) {
        fnBuildRecursiveTasksTreeDelete($oChildTask);
        R::trashBatch(T_TASKS, [$oChildTask->id]);
    }

    R::trashBatch(T_TASKS, [$oTask->id]);
}

function fnBuildRecursiveCategoriesTreeDelete($oCategory) 
{
    $aChildren = R::findAll(T_CATEGORIES, " tcategories_id = {$oCategory->id}");

    foreach ($aChildren as $oChildCategory) {
        fnBuildRecursiveCategoriesTreeDelete($oChildCategory);
        R::trashBatch(T_CATEGORIES, [$oChildCategory->id]);
    }

    $aTasks = R::findAll(T_TASKS, " tcategories_id = {$oCategory->id}");

    foreach ($aTasks as $oChildTask) {
        fnBuildRecursiveTasksTreeDelete($oChildTask);
    }

    R::trashBatch(T_CATEGORIES, [$oCategory->id]);
}