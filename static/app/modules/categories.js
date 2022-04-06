import { tpl, fnAlertMessage } from "./lib.js"

export class Categories {
    static sURL = ``

    static _oSelected = null;
    
    static oURLs = {
        create: 'ajax.php?method=create_category',
        update: tpl`ajax.php?method=update_category&id=${0}`,
        delete: 'ajax.php?method=delete_category',
        list: `ajax.php?method=list_tree_categories`,

        move_to_root_category: 'ajax.php?method=move_to_root_category',

        list_tree_categories: `ajax.php?method=list_tree_categories`,
    }
    static oWindowTitles = {
        create: 'Новая категория',
        update: 'Редактировать категория'
    }
    static oEvents = {
        tasks_save: "tasks:save",
        categories_save: "categories:save",
        categories_select: "categories:select",
    }

    static get oDialog() {
        return $('#categories-dlg');
    }
    static get oDialogForm() {
        return $('#categories-dlg-fm');
    }
    static get oComponent() {
        return $("#categories-tree");
    }
    static get oContextMenu() {
        return $("#categories-mm");
    }

    static get oCategoryTreeList() {
        return $("#categories-category_id");
    }

    static get oEditDialogSaveBtn() {
        return $('#categories-dlg-save-btn');
    }
    static get oEditDialogCancelBtn() {
        return $('#categories-dlg-cancel-btn');
    }

    static get oPanelAddButton() {
        return $('#categories-add-btn');
    }
    static get oPanelEditButton() {
        return $('#categories-edit-btn');
    }
    static get oPanelRemoveButton() {
        return $('#categories-remove-btn');
    }
    static get oPanelReloadButton() {
        return $('#categories-reload-btn');
    }

    static get fnComponent() {
        return this.oComponent.tree.bind(this.oComponent);
    }

    static get oSelectedCategory() {
        return this._oSelected;
    }

    static fnShowDialog(sTitle) {
        this.oDialog.dialog('open').dialog('center').dialog('setTitle', sTitle);
    }
    static fnDialogFormLoad(oRows={}) {
        this.oDialogForm.form('clear');
        this.oDialogForm.form('load', oRows);
    }

    static fnShowCreateWindow() {
        this.sURL = this.oURLs.create;
        var oData = {}
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

    static fnReload() {
        this.fnComponent('reload');
    }

    static fnSave() {
        this.oDialogForm.form('submit', {
            url: this.sURL,
            iframe: false,
            onSubmit: function(){
                return $(this).form('validate');
            },
            success: (function(result){
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
                (function(r) {
                    if (r) {
                        $.post(
                            this.oURLs.delete,
                            { id: oRow.id },
                            (function(result) {
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
                this.oURLs.move_to_root_category,
                { id: oRow.id },
                (function(result) {
                    this.fnReload();
                    this.fnReloadLists();
                }).bind(this),
                'json'
            );
        }
    }

    static fnGetSelected() {
        return this.fnComponent('getSelected');
    }

    static fnSelect(oTarget) {
        this.fnComponent('select', oTarget);
    }

    static fnReloadLists()
    {
        this.oCategoryTreeList.combotree('reload');
    }

    static fnBindEvents()
    {
        $(document).on(this.oEvents.categories_select, ((oEvent, oNode) => {
            this.fnReloadLists();
        }).bind(this))

        $(document).on(this.oEvents.tasks_save, ((oEvent, oNode) => {
            this.fnReload();
        }).bind(this))

        this.oEditDialogSaveBtn.click((() => {
            this.fnSave();
        }).bind(this))
        this.oEditDialogCancelBtn.click((() => {
            this.oDialog.dialog('close');
        }).bind(this))

        this.oPanelAddButton.click((() => {
            this.fnShowCreateWindow();
        }).bind(this))
        this.oPanelEditButton.click((() => {
            this.fnShowEditWindow(this.fnGetSelected());
        }).bind(this))
        this.oPanelRemoveButton.click((() => {
            this.fnDelete(this.fnGetSelected());
        }).bind(this))
        this.oPanelReloadButton.click((() => {
            this.fnReload();
        }).bind(this))
    }

    static fnFireEvent_Save() {
        $(document).trigger(this.oEvents.categories_save);
    }

    static fnFireEvent_Select(oNode) {
        $(document).trigger(this.oEvents.categories_select, [oNode])
    }

    static fnInitComponentCategoryTreeList()
    {
        this.oCategoryTreeList.combotree({
            url: this.oURLs.list_tree_categories,
            method: 'get',
            labelPosition: 'top',
            width: '100%',
            // editable: true,
            // onChange: ((sO, sN) => {
            //     console.log([sO, sN]);
            //     if (!this.oDialog.closed && sO && !sN) {
            //         this.oCategoryTreeList.combotree('clear');
            //     }
            // }).bind(this),
        })
    }

    static fnInitComponent()
    {
        this.fnComponent({
            url: this.oURLs.list,
            method:'get',
            animate:true,
            lines:true,
            dnd:true,
            onSelect: ((oNode) => {
                this._oSelected = oNode;
                this.fnFireEvent_Select(oNode);
            }).bind(this),
            onContextMenu: (function(e, node) {
                e.preventDefault();
                this.fnSelect(node.target);
                this.oContextMenu.menu('show', {
                    left: e.pageX,
                    top: e.pageY,
                    onClick: ((item) => {
                        if (item.id == 'create_category') {
                            this.fnShowCreateWindow();
                        }
                        if (item.id == 'create_note') {
                            this.fnCreateNote();
                        }
                        if (item.id == 'edit') {
                            this.fnShowEditWindow(node);
                        }
                        if (item.id == 'delete') {
                            this.fnDelete(node);
                        }
                        if (item.id == 'move_to_root_category') {
                            this.fnMoveToRoot(node);
                        }
                    }).bind(this)
                });
            }).bind(this),
            formatter: function(node) {
                var s = node.text;
                if (node.children){
                    s += '&nbsp;<span style=\'color:blue\'>(' + node.notes_count + ')</span>';
                }
                return s;
            }
        })
    }

    static fnPrepare()
    {
        this.fnBindEvents();
        this.fnInitComponentCategoryTreeList();
        this.fnInitComponent()
    }
}