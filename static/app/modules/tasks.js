import { tpl, fnAlertMessage } from "./lib.js"

export class Tasks {
    static sURL = ``

    static oURLs = {
        create: 'ajax.php?method=create_task',
        update: tpl`ajax.php?method=update_task&id=${0}`,
        delete: 'ajax.php?method=delete_task',
        list: tpl`ajax.php?method=list_tree_tasks&category_id=${0}`,

        move_to_root_task: 'ajax.php?method=move_to_root_task',

        remove_today_task: 'ajax.php?method=remove_today_task',
        make_today_task: 'ajax.php?method=make_today_task',

        list_undone: tpl`ajax.php?method=list_last_undone_tasks&category_id=${0}`,
        list_done: tpl`ajax.php?method=list_last_done_tasks&category_id=${0}`,

        check_task: 'ajax.php?method=check_task',
        uncheck_task: 'ajax.php?method=uncheck_task',

        list_tree_categories: `ajax.php?method=list_tree_categories`,
        list_tree_tasks: tpl`ajax.php?method=list_tree_tasks&category_id=${0}`,

        update_task_priority: 'ajax.php?method=update_task_priority',
        update_task_status: 'ajax.php?method=update_task_status',
    }
    static oWindowTitles = {
        create: 'Новая задача',
        update: 'Редактировать задачу'
    }
    static oEvents = {
        tasks_save: "tasks:save",
        tasks_make_today_task: "tasks:make_today_task",
        tasks_item_click: "tasks:item_click",
        categories_save: "categories:save",
        categories_select: "categories:select",
    }

    static _oSelectedCategory = null;
    static _oSelectedRow = null;

    static _oProritiesList = {};
    static _oStatusesList = {};

    static get sTodoListToolbar() {
        return `#tasks-list-tb`;
    }

    static get oDialog() {
        return $('#tasks-dlg');
    }
    static get oDialogForm() {
        return $('#tasks-dlg-fm');
    }

    static get oTasksNameInput() {
        return $($('#tasks-name-fieldblock input')[1]);
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

    static get oTitle() {
        return $("#main-panel > div.easyui-layout.layout.easyui-fluid > div.panel.layout-panel.layout-panel-center.panel-htop > div > div.panel.panel-htop.easyui-fluid > div.panel-header > div.panel-title")
    }

    static get oQuickTaskInput() {
        return $("#quick-task-input");
    }

    static get oCategoryTreeList() {
        return $("#tasks-category_id");
    }
    static get oTasksTreeList() {
        return $("#tasks-task_id");
    }

    static get oEditDialogCategoryCleanBtn() {
        return $('#tasks-category-clean-btn');
    }
    static get oEditDialogParentTaskCleanBtn() {
        return $('#tasks-task-clean-btn');
    }
    static get oEditDialogSaveBtn() {
        return $('#tasks-dlg-save-btn');
    }
    static get oEditDialogCancelBtn() {
        return $('#tasks-dlg-cancel-btn');
    }


    static get oUndonePanelUnselectButton() {
        return $('#tasks-unselect-btn');
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
        this.oDialogForm.form('clear');
        this.oDialogForm.form('load', oRows);
        this.oCategoryTreeList.combotree('setValue', oRows.category_id);
        this.oTasksTreeList.combotree('setValue', oRows.task_id);
        this.oTasksNameInput.focus();
    }

    static fnShowCreateWindow() {
        this.sURL = this.oURLs.create;
        this._oSelectedRow = this.fnGetSelectedUndone();
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

    static fnSelectUndone(oTarget) {
        this.fnComponentUndone('select', oTarget);
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

    static fnRemoveTodayTask(oRow) {
        if (oRow){
            $.post(
                this.oURLs.remove_today_task,
                { id: oRow.id },
                (function(result) {
                    this.fnFireEvent_MakeTodayTask();
                    this.fnReload();
                    this.fnReloadLists();
                }).bind(this),
                'json'
            );
        }
    }

    static fnMakeTodayTask(oRow) {
        if (oRow){
            $.post(
                this.oURLs.make_today_task,
                { id: oRow.id },
                (function(result) {
                    this.fnFireEvent_MakeTodayTask();
                    this.fnReload();
                    this.fnReloadLists();
                }).bind(this),
                'json'
            );
        }
    }

    static fnUpdatePriority(oRow, iValue)
    {
        return $.post(
            this.oURLs.update_task_priority,
            { 
                id: oRow.id,
                priority: iValue
            },
            (function(result) {
                this.fnReload();
                this.fnReloadLists();
            }).bind(this),
            'json'
        );
    }

    static fnUpdateStatus(oRow, iValue)
    {
        return $.post(
            this.oURLs.update_task_status,
            { 
                id: oRow.id,
                status: iValue
            },
            (function(result) {
                this.fnReload();
                this.fnReloadLists();
            }).bind(this),
            'json'
        );
    }

    static fnReloadStatusesList()
    {
        return $.post(
            'ajax.php?method=list_statuses',
            { },
            (function(result) {
                this._oStatusesList = result;

                for (var iIndex in this._oStatusesList) {
                    var sValue = this._oStatusesList[iIndex];
                    this.oContextMenu.menu('appendItem', {
                        parent: $("#status")[0],
                        text: sValue,
                        id: `update_status-${iIndex}`
                    });
                }
            }).bind(this),
            'json'
        );
    }

    static fnReloadPrioritiesList()
    {
        return $.post(
            'ajax.php?method=list_priories',
            { },
            (function(result) {
                this._oProritiesList = result;

                for (var iIndex in this._oProritiesList) {
                    var sValue = this._oProritiesList[iIndex];
                    this.oContextMenu.menu('appendItem', {
                        parent: $("#priority")[0],
                        text: sValue,
                        id: `update_priority-${iIndex}`
                    });
                }
            }).bind(this),
            'json'
        );
    }

    static fnFireEvent_MakeTodayTask() {
        $(document).trigger(this.oEvents.tasks_make_today_task);
    }

    static fnReloadLists()
    {
        var iCID = this._oSelectedCategory ? this._oSelectedCategory.id : 0;
        var iRID = this._oSelectedCategory ? this._oSelectedCategory.id : 0;

        this.oCategoryTreeList.combotree('reload');
        this.oCategoryTreeList.combotree('setValue', iCID);
        this.oTasksTreeList.combotree('reload', this.oURLs.list_tree_tasks(iCID));
        this.oTasksTreeList.combotree('setValue', iRID);
    }

    static fnShowMessageCategoryNotSelected()
    {
        alert("Категория не выбрана");
    }

    static fnBindEvents()
    {
        $(document).on(this.oEvents.categories_select, ((oEvent, oNode) => {
            this._oSelectedRow = null; 
            this._oSelectedCategory = oNode;
            this.fnReloadLists();

            this.fnComponentUndone('unselectAll');
            // this.fnComponentDone('unselectAll');

            this.fnInitComponent();
        }).bind(this))

        $(document).on(this.oEvents.categories_save, ((oEvent, oNode) => {
            this.fnReloadLists();
        }).bind(this))

        this.oQuickTaskInput.on('keydown', ((oEvent) => {
            if (oEvent.which == 13 || oEvent.keyCode == 13) {
                $.post(
                    this.oURLs.create,
                    { 
                        category_id: this._oSelectedCategory.id,
                        task_id: this._oSelectedRow ? this._oSelectedRow.id : null,
                        name: oEvent.target.value,
                        description: '',
                    },
                    (function(result) {
                        this.fnReload();
                        this.fnReloadLists();
                    }).bind(this),
                    'json'
                );

                oEvent.target.value = '';
            }
        }).bind(this));

        this.oEditDialogCategoryCleanBtn.click((() => {
            this.oCategoryTreeList.combotree('clear');
        }).bind(this))
        this.oEditDialogParentTaskCleanBtn.click((() => {
            this.oTasksTreeList.combotree('clear');
        }).bind(this))
        this.oEditDialogSaveBtn.click((() => {
            this.fnSave();
        }).bind(this))
        this.oEditDialogCancelBtn.click((() => {
            this.oDialog.dialog('close');
        }).bind(this))

        
        this.oUndonePanelUnselectButton.click((() => {
            this._oSelectedRow = null;
            this.fnComponentUndone('unselectAll');
        }).bind(this))
        this.oUndonePanelAddButton.click((() => {
            if (!this._oSelectedCategory) {
                return this.fnShowMessageCategoryNotSelected();
            }

            this._oSelectedRow = this.fnGetSelectedUndone();

            this.fnShowCreateWindow();
        }).bind(this))
        this.oUndonePanelEditButton.click((() => {
            if (!this._oSelectedCategory) {
                return this.fnShowMessageCategoryNotSelected();
            }

            var oSelected = this._oSelectedRow = this.fnGetSelectedUndone();

            if (oSelected) {
                this.fnShowEditWindow(oSelected);
            }
        }).bind(this))
        this.oUndonePanelRemoveButton.click((() => {
            if (!this._oSelectedCategory) {
                return this.fnShowMessageCategoryNotSelected();
            }

            var oSelected = this._oSelectedRow = this.fnGetSelectedUndone();
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

            onChange: ((newValue,oldValue) => {
                this.oTasksTreeList.combotree('setValue', null);
                this.oTasksTreeList.combotree('reload', this.oURLs.list_tree_tasks(newValue));
            }).bind(this),

            // onLoadSuccess: ((node, data) => {
            //     if (this._oSelectedCategory) {
            //         this.oCategoryTreeList.combotree('setValue', this._oSelectedCategory.id);
            //     }
            // }).bind(this),
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

            // onLoadSuccess: ((node, data) => {
            //     if (this._oSelectedRow) {
            //         this.oTasksTreeList.combotree('setValue', this._oSelectedRow.id);
            //     }
            // }).bind(this),
        })
    }

    static fnInitTaskInputComponent()
    {
        this.oTitle.html(`<input id="quick-task-input" type="text" style="position:absolute;width:calc(100% - 200px)"/>`)
    }

    static fnInitComponent()
    {
        var iCID = this._oSelectedCategory ? this._oSelectedCategory.id : 0;

        this.fnComponentUndone({
            singleSelect: true,

            url: this.oURLs.list(iCID),
            method: 'get',
            height: "100%",
            rownumbers: true,

            // striped: true,
            // nowrap: false,
            autoRowHeight: true,

            idField: 'id',
            treeField: 'text',

            // checkbox: true,

            columns:[[
                {
                    field:'status',
                    title:'Статус',
                    width: '10%',
                    formatter: (function(value,row,index) {
                        return `<div class="badge status-${value}">${this._oStatusesList[value]}</style>`
                    }).bind(this),
                },
                {   
                    field:'priority',
                    title:'Приоритет',
                    width: '10%',
                    formatter: (function(value,row,index){
                        return `<div class="badge priority-${value}">${this._oProritiesList[value]}</style>`
                    }).bind(this),
                },
                {
                    field:'text',title:'Описание',
                    formatter: (function(value,row,index){
                        if (this._oSelectedCategory && this._oSelectedCategory.id<1 && row.category) {
                            value = row.category + ' - ' + value;
                        }

                        var aV = value.split(' - ');

                        for (var iI in aV) {
                            if (iI<aV.length-1) {
                                var iH = 1;
                                for (var iC=0; iC<aV[iI].length; iC++) {
                                    iH *= aV[iI].charCodeAt(iC)*425345345;
                                }
                                iH = iH % 360;
                                var iS = 85 + (5 - iH % 10);
                                var sC = `hsl(${iH}, ${iS}%, ${iS}%);`;
                                aV[iI] = `<span style="background: ${sC}" class="badge-normal">${aV[iI]}</span>`;
                            }
                        }

                        return aV.join(` - `);
                    }).bind(this),
                    width: '63%'
                },
                {field:'created_at',title:'Создано',width: '17%'},
            ]],

            rowStyler: function(row) {
                var sC = (row.status == '4') ? '0.5' : '1.0';
                return `opacity: ${sC};`
            },

            onCheckNode: ((row,checked) => {
                if (checked) {
                    this.fnCheckTask(row);
                } else {
                    this.fnUncheckTask(row);
                }
            }).bind(this),

            onSelect: ((iIndex, oNode) => {
                this._oSelectedRow = this.fnGetSelectedUndone();
            }).bind(this),

            onUnselect: (() => {
                this._oSelectedRow = null;
            }).bind(this),

            onContextMenu: ((e, node) => {
                e.preventDefault();

                this.fnSelectUndone(node.id);

                this._oSelectedRow = this.fnGetSelectedUndone();
                
                this.oContextMenu.menu('show', {
                    left: e.pageX,
                    top: e.pageY,
                    onClick: (item) => {
                        // if (item.id == 'check') {
                        //     this.fnCheckTask(node);
                        // }
                        // if (item.id == 'uncheck') {
                        //     this.fnUncheckTask(node);
                        // }
                        if (item.id == 'add') {
                            this.fnShowCreateWindow();
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

                        if (item.id == 'remove_today_task') {
                            this.fnRemoveTodayTask(node);
                        }
                        if (item.id == 'make_today_task') {
                            this.fnMakeTodayTask(node);
                        }

                        if (item.id.startsWith('update_priority')) {
                            console.log([node, item]);
                            this.fnUpdatePriority(node, item.id.replace(/\D+/, ''));
                        }
                        if (item.id.startsWith('update_status')) {
                            this.fnUpdateStatus(node, item.id.replace(/\D+/, ''));
                        }
                    }
                });
            }).bind(this),
        });
    }

    static fnPrepare()
    {
        this.fnReloadStatusesList()
            .done((() => {
                this.fnReloadPrioritiesList()
                    .done((() => {
                        this.fnInitTaskInputComponent();
                        this.fnInitComponentCategoryTreeList();
                        this.fnInitComponentTaskTreeList();
                        this.fnInitComponent();
                        this.fnBindEvents();                
                    }).bind(this))
            }).bind(this))
    }
}