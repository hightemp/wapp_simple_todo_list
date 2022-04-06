<div class="easyui-layout" data-options="fit:true">
    <div data-options="region:'west',split:true" title="" style="width:300px;">
        <div 
            class="easyui-panel" 
            title="  " 
            style="padding:0px;"
            data-options="tools:'#categories-tt', fit:true"
        >
            <ul id="categories-tree" class="easyui-tree"></ul>
        </div>
        <div id="categories-tt">
            <a href="javascript:void(0)" class="icon-add" id="categories-add-btn"></a>
            <a href="javascript:void(0)" class="icon-edit" id="categories-edit-btn"></a>
            <a href="javascript:void(0)" class="icon-remove" id="categories-remove-btn"></a>
            <a href="javascript:void(0)" class="icon-reload" id="categories-reload-btn"></a>
        </div>
    </div>
    <div data-options="region:'center',title:'',iconCls:'icon-ok'">
        <div class="easyui-layout" data-options="fit:true">
            <div data-options="region:'north',split:true" title="" style="height:500px;">
                <div 
                    class="easyui-panel" 
                    title="  " 
                    style="padding:0px;"
                    data-options="tools:'#tasks-undone-tt', fit:true"
                >
                    <table id="tasks-undone-tg" class="easyui-treegrid"></table>
                </div>
                <div id="tasks-undone-tt">
                    <a href="javascript:void(0)" class="icon-add" id="tasks-undone-add-btn"></a>
                    <a href="javascript:void(0)" class="icon-edit" id="tasks-undone-edit-btn"></a>
                    <a href="javascript:void(0)" class="icon-remove" id="tasks-undone-remove-btn"></a>
                    <a href="javascript:void(0)" class="icon-reload" id="tasks-undone-reload-btn"></a>
                </div>
            </div>
            <div data-options="region:'center',split:true" title="" style="height:auto;">
                <div 
                    class="easyui-panel" 
                    title="  " 
                    style="padding:0px;"
                    data-options="tools:'#tasks-done-tt', fit:true"
                >
                    <table id="tasks-done-tg" class="easyui-treegrid"></table>
                </div>
                <div id="tasks-done-tt">
                    <a href="javascript:void(0)" class="icon-add" id="tasks-done-add-btn"></a>
                    <a href="javascript:void(0)" class="icon-edit" id="tasks-done-edit-btn"></a>
                    <a href="javascript:void(0)" class="icon-remove" id="tasks-done-remove-btn"></a>
                    <a href="javascript:void(0)" class="icon-reload" id="tasks-done-reload-btn"></a>
                </div>
            </div>
        </div>
    </div>
</div>

<div style="position:fixed">
    <!-- Категории -->
    <div id="categories-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#categories-dlg-buttons'">
        <form id="categories-dlg-fm" method="post" novalidate style="margin:0;padding:5px">
            <div style="margin-bottom:10px">
                <label>Категория:</label>
                <input id="categories-category_id" name="category_id" class="easyui-combotree" style="width:100%">
            </div>
            <div style="margin-bottom:10px">
                <label>Заголовок:</label>
                <input name="name" class="easyui-textbox" required="true" style="width:100%">
            </div>
            <div style="margin-bottom:10px">
                <label>Описание:</label>
                <input name="description" class="easyui-textbox" style="width:100%;height:200px" multiline="true">
            </div>
        </form>
    </div>
    <div id="categories-dlg-buttons">
        <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" id="categories-dlg-save-btn" style="width:auto">Сохранить</a>
        <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" id="categories-dlg-cancel-btn" style="width:auto">Отмена</a>
    </div>

    <!-- Задачи -->
    <div id="tasks-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#tasks-dlg-buttons'">
        <form id="tasks-dlg-fm" method="post" novalidate style="margin:0;padding:5px">
            <div style="margin-bottom:10px">
                <label>Категория:</label>
                <input id="tasks-category_id" name="category_id" required="true" class="easyui-combotree" style="width:100%">
            </div>
            <div style="margin-bottom:10px">
                <label>Родительская задача:</label>
                <input id="tasks-task_id" name="task_id" class="easyui-combotree" style="width:100%">
            </div>
            <div style="margin-bottom:10px">
                <label>Заголовок:</label>
                <input name="name" class="easyui-textbox" style="width:100%;">
            </div>
            <div style="margin-bottom:10px">
                <label>Описание:</label>
                <input name="description" class="easyui-textbox" style="width:100%;height:200px" multiline="true">
            </div>
        </form>
    </div>
    <div id="tasks-dlg-buttons">
        <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" id="tasks-dlg-save-btn" style="width:auto">Сохранить</a>
        <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" id="tasks-dlg-cancel-btn" style="width:auto">Отмена</a>
    </div>

    <div id="categories-mm" class="easyui-menu" style="width:auto;">
        <div data-options="id:'move_to_root_category'">Переместить в корень</div>
        <div data-options="id:'edit'">Радактировать</div>
        <div data-options="id:'delete'">Удалить</div>
    </div>
    <div id="tasks-mm" class="easyui-menu" style="width:auto;">
        <div data-options="id:'check'">Выполнено</div>
        <div data-options="id:'uncheck'">Не выполнено</div>
        <div data-options="id:'move_to_root_task'">Переместить в корень</div>
        <div data-options="id:'edit'">Радактировать</div>
        <div data-options="id:'delete'">Удалить</div>
    </div>
</div>