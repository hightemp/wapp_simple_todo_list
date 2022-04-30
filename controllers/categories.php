<?php

// Таблицы

if ($sMethod == 'list_tree_categories') {
    if (isset($aRequest['category_id'])) {
        $aCategories = R::findAll(T_CATEGORIES, 'tcategories_id = ?', [$aRequest['category_id']]);
    } else {
        $aCategories = R::findAll(T_CATEGORIES, 'tcategories_id IS NULL');
    }
    $aResult = [];

    fnBuildRecursiveCategoriesTree($aResult, $aCategories);

    $aResult = array_merge([
        ["id" => "0", "text" => "Все", "name" => "Все"]
    ], $aResult);

    die(json_encode(array_values($aResult)));
}

if ($sMethod == 'list_categories') {
    $aResponse = R::findAll(T_CATEGORIES);
    die(json_encode(array_values($aResponse)));
}

if ($sMethod == 'get_category') {
    $aResponse = R::findOne(T_CATEGORIES, "id = ?", [$aRequest['id']]);
    die(json_encode($aResponse));
}

if ($sMethod == 'delete_category') {
    $oCategory = R::findOne(T_CATEGORIES, "id = ?", [$aRequest['id']]);

    fnBuildRecursiveCategoriesTreeDelete($oCategory);

    die(json_encode([]));
}

if ($sMethod == 'update_category') {
    $oCategory = R::findOne(T_CATEGORIES, "id = ?", [$aRequest['id']]);

    $oCategory->name = $aRequest['name'];
    $oCategory->description = $aRequest['description'];

    if (isset($aRequest['category_id']) && !empty($aRequest['category_id'])) {
        $oCategory->tcategories = R::findOne(T_CATEGORIES, "id = ?", [$aRequest['category_id']]);
    }

    R::store($oCategory);

    die(json_encode([
        "id" => $oCategory->id, 
        "name" => $oCategory->name
    ]));
}

if ($sMethod == 'create_category') {
    $oCategory = R::dispense(T_CATEGORIES);

    $oCategory->name = $aRequest['name'];
    $oCategory->description = $aRequest['description'];

    if (isset($aRequest['category_id']) && !empty($aRequest['category_id'])) {
        $oCategory->tcategories = R::findOne(T_CATEGORIES, "id = ?", [$aRequest['category_id']]);
    }

    R::store($oCategory);

    die(json_encode([
        "id" => $oCategory->id, 
        "name" => $oCategory->name
    ]));
}

if ($sMethod == 'move_to_root_category') {
    $oCategory = R::findOne(T_CATEGORIES, "id = ?", [$aRequest['id']]);

    $oCategory->tcategories = NULL;

    R::store($oCategory);

    die(json_encode([
        "id" => $oCategory->id, 
        "text" => $oCategory->name
    ]));
}