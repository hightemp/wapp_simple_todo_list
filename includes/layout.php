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
        <!-- <div class="easyui-layout" data-options="fit:true">
            <div data-options="region:'north',split:true" title="" style="height:500px;"> -->
                <div 
                    class="easyui-panel" 
                    title="  " 
                    style="padding:0px;"
                    data-options="tools:'#tasks-undone-tt',fit:true"
                >
                    <table id="tasks-undone-tg" class="easyui-treegrid"></table>
                </div>
                <div id="tasks-undone-tt">
                    <a href="javascript:void(0)" class="icon-tip" id="tasks-unselect-btn"></a>
                    <a href="javascript:void(0)" class="icon-add" id="tasks-undone-add-btn"></a>
                    <a href="javascript:void(0)" class="icon-edit" id="tasks-undone-edit-btn"></a>
                    <a href="javascript:void(0)" class="icon-remove" id="tasks-undone-remove-btn"></a>
                    <a href="javascript:void(0)" class="icon-reload" id="tasks-undone-reload-btn"></a>
                </div>
            <!-- </div>
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
        </div> -->
    </div>
</div>

<div style="position:fixed">
    <!-- ?????????????????? -->
    <div id="categories-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#categories-dlg-buttons'">
        <form id="categories-dlg-fm" method="post" novalidate style="margin:0;padding:5px">
            <div style="margin-bottom:10px">
                <label>??????????????????:</label>
                <div class="input-with-btn">
                    <div><input id="categories-category_id" name="category_id" class="easyui-combotree" style="width:100%"></div>
                    <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-remove" id="categories-category-clean-btn" style="width:auto"></a>
                </div>
            </div>
            <div style="margin-bottom:10px">
                <label>??????????????????:</label>
                <input name="name" class="easyui-textbox" required="true" style="width:100%">
            </div>
            <div style="margin-bottom:10px">
                <label>????????????????????:</label>
                <input name="sort" class="easyui-textbox" style="width:100%">
            </div>
            <div style="margin-bottom:10px">
                <label>????????????????:</label>
                <input name="description" class="easyui-textbox" style="width:100%;height:200px" multiline="true">
            </div>
        </form>
    </div>
    <div id="categories-dlg-buttons">
        <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" id="categories-dlg-save-btn" style="width:auto">??????????????????</a>
        <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-remove" id="categories-dlg-cancel-btn" style="width:auto">????????????</a>
    </div>

    <!-- ???????????? -->
    <div id="tasks-dlg" class="easyui-dialog" style="width:500px" data-options="closed:true,modal:true,border:'thin',buttons:'#tasks-dlg-buttons'">
        <form id="tasks-dlg-fm" method="post" novalidate style="margin:0;padding:5px">
            <div style="margin-bottom:10px">
                <label>??????????????????:</label>
                <div class="input-with-btn">
                    <div><input id="tasks-category_id" name="category_id" required="true" class="easyui-combotree" style="width:100%"></div>
                    <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-remove" id="tasks-category-clean-btn" style="width:auto"></a>
                </div>
            </div>
            <div style="margin-bottom:10px">
                <label>???????????????????????? ????????????:</label>
                <div class="input-with-btn">
                    <div><input id="tasks-task_id" name="task_id" class="easyui-combotree" style="width:100%"></div>
                    <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-remove" id="tasks-task-clean-btn" style="width:auto"></a>
                </div>
            </div>
            <div style="margin-bottom:10px" id="tasks-name-fieldblock">
                <label>??????????????????:</label>
                <input name="name" class="easyui-textbox" style="width:100%;" id="tasks-name">
            </div>
            <div style="margin-bottom:10px">
                <label>????????????????????:</label>
                <input name="sort" class="easyui-textbox" style="width:100%">
            </div>
            <div style="margin-bottom:10px">
                <label>????????????????:</label>
                <input name="description" class="easyui-textbox" style="width:100%;height:200px" multiline="true">
            </div>
        </form>
    </div>
    <div id="tasks-dlg-buttons">
        <a href="javascript:void(0)" class="easyui-linkbutton c6" iconCls="icon-ok" id="tasks-dlg-save-btn" style="width:auto">??????????????????</a>
        <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-cancel" id="tasks-dlg-cancel-btn" style="width:auto">????????????</a>
    </div>

    <div id="categories-mm" class="easyui-menu" style="width:auto;">
        <div data-options="id:'move_to_root_category'">?????????????????????? ?? ????????????</div>
        <div data-options="id:'edit'">??????????????????????????</div>
        <div data-options="id:'delete'">??????????????</div>
    </div>
    <div id="tasks-mm" class="easyui-menu" style="width:auto;">
        <!-- <div data-options="id:'check'">??????????????????</div>
        <div data-options="id:'uncheck'">???? ??????????????????</div> -->
        <div data-options="id:'status',iconCls:'icon-tag_blue'">
            <span>????????????</span>
            <div style="width:200px;" id="status-submenu">
                <!-- <div></div> -->
            </div>
        </div>
        <div data-options="id:'priority',iconCls:'icon-medal_bronze_1'">
            <span>??????????????????</span>
            <div style="width:200px;" id="priority-submenu">
                <!-- <div></div> -->
            </div>
        </div>

        <div data-options="id:'remove_today_task',iconCls:'icon-clock_delete'">???????????? ???? ?????????? ??????. ??????</div>
        <div data-options="id:'make_today_task',iconCls:'icon-clock_add'">???????????????? ?? ???????????? ??????. ??????</div>

        <div data-options="id:'add',iconCls:'icon-add'">???????????????? ????????????</div>
        <div data-options="id:'move_to_root_task',iconCls:'icon-bricks'">?????????????????????? ?? ????????????</div>
        <div data-options="id:'edit',iconCls:'icon-edit'">??????????????????????????</div>
        <div data-options="id:'delete',iconCls:'icon-bin'">??????????????</div>
    </div>
</div>