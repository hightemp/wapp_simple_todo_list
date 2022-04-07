import { tpl, fnAlertMessage } from "./lib.js"

export class Tasks {
    static sURL = ``

    static oURLs = {
        create: 'ajax.php?method=create_task',
        update: tpl`ajax.php?method=update_task&id=${0}`,
        delete: 'ajax.php?method=delete_task',
        list: tpl`ajax.php?method=list_notes&category_id=${0}`,

        move_to_root_task: 'ajax.php?method=move_to_root_task',

        list_undone: tpl`ajax.php?method=list_last_undone_tasks&category_id=${0}`,
        list_done: tpl`ajax.php?method=list_last_done_tasks&category_id=${0}`,

        check_task: 'ajax.php?method=check_task',
        uncheck_task: 'ajax.php?method=uncheck_task',

        list_tree_categories: `ajax.php?method=list_tree_categories`,
        list_tree_tasks: tpl`ajax.php?method=list_tree_tasks&category_id=${0}`,
    }
    static oWindowTitles = {
        create: 'Новая задача',
        update: 'Редактировать задачу'
    }
    static oEvents = {
        tasks_save: "tasks:save",
        tasks_item_click: "tasks:item_click",
        categories_save: "categories:save",
        categories_select: "categories:select",
    }

    static _oSelectedCategory = null;
    static _oSelectedRow = null;

    static get sTodoListToolbar() {
        return `#tasks-list-tb`;
    }

    static get oDialog() {
        return $('#tasks-dlg');
    }
    static get oDialogForm() {
        return $('#tasks-dlg-fm');
    }

    static get oComponentUndone() {
        return $("#tasks-undone-tg");
    }
    static get oComponentDone() {
        return $("#tasks-done-tg");
    }
    static get oContextMenu() {
        return $("#tasks-mm");
    }

    static get oCategoryTreeList() {
        return $("#tasks-category_id");
    }
    static get oTasksTreeList() {
        return $("#tasks-task_id");
    }

    static get oEditDialogSaveBtn() {
        return $('#tasks-dlg-save-btn');
    }
    static get oEditDialogCancelBtn() {
        return $('#tasks-dlg-cancel-btn');
    }

    static get oUndonePanelAddButton() {
        return $('#tasks-undone-add-btn');
    }
    static get oUndonePanelEditButton() {
        return $('#tasks-undone-edit-btn');
    }
    static get oUndonePanelRemoveButton() {
        return $('#tasks-undone-remove-btn');
    }
    static get oUndonePanelReloadButton() {
        return $('#tasks-undone-reload-btn');
    }

    static get oDonePanelAddButton() {
        return $('#tasks-done-add-btn');
    }
    static get oDonePanelEditButton() {
        return $('#tasks-done-edit-btn');
    }
    static get oDonePanelRemoveButton() {
        return $('#tasks-done-remove-btn');
    }
    static get oDonePanelReloadButton() {
        return $('#tasks-done-reload-btn');
    }

    static get fnComponentUndone() {
        return this.oComponentUndone.treegrid.bind(this.oComponentUndone);
    }
    static get fnComponentDone() {
        return this.oComponentDone.treegrid.bind(this.oComponentDone);
    }

    static fnShowDialog(sTitle) {
        this.oDialog.dialog('open').dialog('center').dialog('setTitle', sTitle);
    }
    static fnDialogFormLoad(oRows={}) {
        this._oSelectedRow = oRows;
        this.oDialogForm.form('clear');
        this.oDialogForm.form('load', oRows);
        this.oCategoryTreeList.combotree('setValue', oRows.category_id);
        this.oTasksTreeList.combotree('setValue', oRows.task_id);
    }

    static fnShowCreateWindow() {
        this.sURL = this.oURLs.create;
        var oData = {
            category_id: this._oSelectedCategory ? this._oSelectedCategory.id : '',
            task_id: this._oSelectedRow ? this._oSelectedRow.id : '',
        }
        this.fnShowDialog(this.oWindowTitles.create);
        this.fnDialogFormLoad(oData);
    }

    static fnShowEditWindow(oRow) {
        if (oRow) {
            this.sURL = this.oURLs.update(oRow.id);
            this.fnShowDialog(this.oWindowTitles.update);
            this.fnDialogFormLoad(oRow);
        }
    }

    static fnCheckTask(row) {
        $.post(
            'ajax.php?method=check_task',
            {id:row.id},
            (function(result){
                this.fnReload();
            }).bind(this),
            'json'
        );
    }
    static fnUncheckTask(row) {
        $.post(
            'ajax.php?method=uncheck_task',
            {id:row.id},
            (function(result){
                this.fnReload();
            }).bind(this),
            'json'
        );
    }

    static fnGetSelectedUndone() {
        return this.fnComponentUndone('getSelected');
    }
    static fnGetSelectedDone() {
        return this.fnComponentDone('getSelected');
    }

    static fnReload() {
        this.fnComponentUndone('reload');
        this.fnComponentDone('reload');
    }

    static fnSave() {
        this.oDialogForm.form('submit', {
            url: this.sURL,
            iframe: false,
            onSubmit: () => {
                return this.oDialogForm.form('validate');
            },
            success: ((result) => {
                this.oDialog.dialog('close');
                this.fnReload();

                this.fnReloadLists();    

                this.fnFireEvent_Save();
            }).bind(this)
        });
    }

    static fnDelete(oRow) {
        if (oRow){
            $.messager.confirm(
                'Confirm',
                'Удалить?',
                ((r) => {
                    if (r) {
                        $.post(
                            this.oURLs.delete,
                            { id: oRow.id },
                            ((result) => {
                                this.fnReload();
                            }).bind(this),
                            'json'
                        );
                    }
                }).bind(this)
            );
        }
    }

    static fnMoveToRoot(oRow) {
        if (oRow){
            $.post(
                this.oURLs.move_to_root_task,
                { id: oRow.id },
                (function(result) {
                    this.fnReload();
                    this.fnReloadLists();
                }).bind(this),
                'json'
            );
        }
    }

    static fnReloadLists()
    {
        var iCID = this._oSelectedCategory ? this._oSelectedCategory.id : 0;

        this.oCategoryTreeList.combotree('reload');
        this.oTasksTreeList.combotree('reload', this.oURLs.list_tree_tasks(iCID));
    }

    static fnShowMessageCategoryNotSelected()
    {
        alert("Категория не выбрана");
    }

    static fnBindEvents()
    {
        $(document).on(this.oEvents.categories_select, ((oEvent, oNode) => {
            this._oSelectedCategory = oNode;
            this.fnReloadLists();

            this.fnComponentUndone('unselectAll');
            this.fnComponentDone('unselectAll');

            this.fnInitComponent();
        }).bind(this))

        $(document).on(this.oEvents.categories_save, ((oEvent, oNode) => {
            this.fnReloadLists();
        }).bind(this))

        this.oEditDialogSaveBtn.click((() => {
            this.fnSave();
        }).bind(this))
        this.oEditDialogCancelBtn.click((() => {
            this.oDialog.dialog('close');
        }).bind(this))

        this.oUndonePanelAddButton.click((() => {
            if (!this._oSelectedCategory) {
                return this.fnShowMessageCategoryNotSelected();
            }

            this.fnShowCreateWindow();
        }).bind(this))
        this.oUndonePanelEditButton.click((() => {
            if (!this._oSelectedCategory) {
                return this.fnShowMessageCategoryNotSelected();
            }

            var oSelected = this.fnGetSelectedUndone();

            if (oSelected) {
                this.fnShowEditWindow(oSelected);
            }
        }).bind(this))
        this.oUndonePanelRemoveButton.click((() => {
            if (!this._oSelectedCategory) {
                return this.fnShowMessageCategoryNotSelected();
            }

            var oSelected = this.fnGetSelectedUndone();
            if (oSelected) {
                this.fnDelete(oSelected);
            }
        }).bind(this))
        this.oUndonePanelReloadButton.click((() => {
            if (!this._oSelectedCategory) {
                return this.fnShowMessageCategoryNotSelected();
            }

            this.fnReload();
        }).bind(this))


        this.oDonePanelAddButton.click((() => {
            if (!this._oSelectedCategory) {
                return this.fnShowMessageCategoryNotSelected();
            }

            this.fnShowCreateWindow();
        }).bind(this))
        this.oDonePanelEditButton.click((() => {
            if (!this._oSelectedCategory) {
                return this.fnShowMessageCategoryNotSelected();
            }

            var oSelected = this.fnGetSelectedUndone();

            if (oSelected) {
                this.fnShowEditWindow(oSelected);
            }
        }).bind(this))
        this.oDonePanelRemoveButton.click((() => {
            if (!this._oSelectedCategory) {
                return this.fnShowMessageCategoryNotSelected();
            }

            var oSelected = this.fnGetSelectedUndone();
            if (oSelected) {
                this.fnDelete(oSelected);
            }
        }).bind(this))
        this.oDonePanelReloadButton.click((() => {
            if (!this._oSelectedCategory) {
                return this.fnShowMessageCategoryNotSelected();
            }

            this.fnReload();
        }).bind(this))
    }

    static fnFireEvent_Save() {
        $(document).trigger(this.oEvents.tasks_save);
    }

    static fnFireEvent_ItemClick(oRow) {
        $(document).trigger(this.oEvents.tasks_item_click, [ oRow ]);
    }

    static fnInitComponentCategoryTreeList()
    {
        this.oCategoryTreeList.combotree({
            url: this.oURLs.list_tree_categories,
            method: 'get',
            labelPosition: 'top',
            width: '100%',
            onLoadSuccess: ((node, data) => {
                if (this._oSelectedCategory) {
                    this.oCategoryTreeList.combotree('setValue', this._oSelectedCategory.id);
                }
            }).bind(this),
        })
    }

    static fnInitComponentTaskTreeList()
    {
        var iCID = this._oSelectedCategory ? this._oSelectedCategory.id : 0;

        this.oTasksTreeList.combotree({
            url: this.oURLs.list_tree_tasks(iCID),
            method: 'get',
            labelPosition: 'top',
            width: '100%',
            onLoadSuccess: ((node, data) => {
                if (this._oSelectedRow) {
                    this.oTasksTreeList.combotree('setValue', this._oSelectedRow.id);
                }
            }).bind(this),
        })
    }

    

    static fnInitComponent()
    {
        var iCID = this._oSelectedCategory ? this._oSelectedCategory.id : 0;

        this.fnComponentUndone({
            singleSelect: true,

            url: this.oURLs.list_undone(iCID),
            method: 'get',
            height: "100%",
            rownumbers: true,

            idField: 'id',
            treeField: 'text',

            columns:[[
                {
                    field:'text',title:'Описание',
                    formatter: function(value,row,index){
                        return `<div class="wrapped-text">${value}</style>`
                    },
                    width:600
                },
                {field:'created_at',title:'Создано',width:200},
            ]],

            onContextMenu: ((e, node) => {
                e.preventDefault();
                this.oContextMenu.menu('show', {
                    left: e.pageX,
                    top: e.pageY,
                    onClick: (item) => {
                        if (item.id == 'check') {
                            this.fnCheckTask(node);
                        }
                        if (item.id == 'uncheck') {
                            this.fnUncheckTask(node);
                        }
                        if (item.id == 'edit') {
                            this.fnShowEditWindow(node);
                        }
                        if (item.id == 'delete') {
                            this.fnDelete(node);
                        }
                        if (item.id == 'move_to_root_task') {
                            this.fnMoveToRoot(node);
                        }
                    }
                });
            }).bind(this),
        });

        this.fnComponentDone({
            singleSelect: true,

            url: this.oURLs.list_done(iCID),
            method: 'get',
            height: "100%",
            rownumbers: true,

            idField:'id',
            treeField:'text',

            columns:[[
                {
                    field:'text',title:'Описание',
                    formatter: function(value,row,index){
                        return `<div class="wrapped-text">${value}</style>`
                    },
                    width:600
                },
                {field:'created_at',title:'Создано',width:200},
            ]],

            onContextMenu: ((e, node) => {
                e.preventDefault();
                this.oContextMenu.menu('show', {
                    left: e.pageX,
                    top: e.pageY,
                    onClick: (item) => {
                        if (item.id == 'check') {
                            this.fnCheckTask(node);
                        }
                        if (item.id == 'uncheck') {
                            this.fnUncheckTask(node);
                        }
                        if (item.id == 'edit') {
                            this.fnShowEditWindow(node);
                        }
                        if (item.id == 'delete') {
                            this.fnDelete(node);
                        }
                        if (item.id == 'move_to_root_task') {
                            this.fnMoveToRoot(node);
                        }
                    }
                });
            }).bind(this),
        });
    }

    static fnPrepare()
    {
        this.fnBindEvents();
        this.fnInitComponentCategoryTreeList();
        this.fnInitComponentTaskTreeList();
        this.fnInitComponent();
    }
}