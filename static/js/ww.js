var data;
var current_id = 0;
var edit_entity;

$(document).ready(function () {
    $("#file_view").show();
    $("#label_view").hide();

    // 上一页响应函数
    $("#pre_button").click(function () {
        if (current_id == 0) {
            alert("已经到头了！");
        } else {
            current_id -= 1;
            render_data(current_id);
        }
    });

    // 下一页响应函数
    $("#next_button").click(function () {
        if (current_id == data.length - 1) {
            alert("已经到底了！");
        } else {
            //跳转到下一页
            current_id += 1;
            render_data(current_id);
        }
    });

    // 选择文件响应函数
    $("#file_input").change(function () {
        var files = $("#file_input").prop("files"); //获取到文件列表

        if (files.length == 0) {
            alert('请选择文件');
            return;
        } else {
            var reader = new FileReader(); //新建一个FileReader
            reader.readAsText(files[0], "UTF-8"); //读取文件
            reader.onload = function (evt) { //读取完文件之后会回来这里
                var fileString = evt.target.result;
                try {
                    data = JSON.parse(fileString);
                    console.log("导入数据成功，共有" + data.length + "条数据!");
                    $("#file_view").hide();
                    $("#label_view").show();

                    current_id = 0;

                    //直接跳转到上次标注结果
                    if (data[current_id].hasOwnProperty("finished")) {
                        current_id = data[current_id]['finished'];
                    }
                    render_data(current_id);
                } catch (err) {
                    alert("解析json文件报错！\n" + err.message);
                }
            }
        }
    });

    // 提交按钮响应函数
    $("#save_button").click(function () {
        data[0]['finished'] = current_id;
        save();
    });

    // 保存标注数据
    function save() {
        var saveAs = saveAs || (function (view) {
            "use strict";
            // IE <10 is explicitly unsupported
            if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
                return;
            }
            var
                doc = view.document
                // only get URL when necessary in case Blob.js hasn't overridden it yet
                ,
                get_URL = function () {
                    return view.URL || view.webkitURL || view;
                },
                save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"),
                can_use_save_link = "download" in save_link,
                click = function (node) {
                    var event = new MouseEvent("click");
                    node.dispatchEvent(event);
                },
                is_safari = /constructor/i.test(view.HTMLElement) || view.safari,
                is_chrome_ios = /CriOS\/[\d]+/.test(navigator.userAgent),
                throw_outside = function (ex) {
                    (view.setImmediate || view.setTimeout)(function () {
                        throw ex;
                    }, 0);
                },
                force_saveable_type = "application/octet-stream"
                // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
                ,
                arbitrary_revoke_timeout = 1000 * 40 // in ms
                ,
                revoke = function (file) {
                    var revoker = function () {
                        if (typeof file === "string") { // file is an object URL
                            get_URL().revokeObjectURL(file);
                        } else { // file is a File
                            file.remove();
                        }
                    };
                    setTimeout(revoker, arbitrary_revoke_timeout);
                },
                dispatch = function (filesaver, event_types, event) {
                    event_types = [].concat(event_types);
                    var i = event_types.length;
                    while (i--) {
                        var listener = filesaver["on" + event_types[i]];
                        if (typeof listener === "function") {
                            try {
                                listener.call(filesaver, event || filesaver);
                            } catch (ex) {
                                throw_outside(ex);
                            }
                        }
                    }
                },
                auto_bom = function (blob) {
                    // prepend BOM for UTF-8 XML and text/* types (including HTML)
                    // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
                    if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                        return new Blob([String.fromCharCode(0xFEFF), blob], {
                            type: blob.type
                        });
                    }
                    return blob;
                },
                FileSaver = function (blob, name, no_auto_bom) {
                    if (!no_auto_bom) {
                        blob = auto_bom(blob);
                    }
                    // First try a.download, then web filesystem, then object URLs
                    var
                        filesaver = this,
                        type = blob.type,
                        force = type === force_saveable_type,
                        object_url, dispatch_all = function () {
                            dispatch(filesaver, "writestart progress write writeend".split(" "));
                        }
                        // on any filesys errors revert to saving with object URLs
                        ,
                        fs_error = function () {
                            if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
                                // Safari doesn't allow downloading of blob urls
                                var reader = new FileReader();
                                reader.onloadend = function () {
                                    var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
                                    var popup = view.open(url, '_blank');
                                    if (!popup) view.location.href = url;
                                    url = undefined; // release reference before dispatching
                                    filesaver.readyState = filesaver.DONE;
                                    dispatch_all();
                                };
                                reader.readAsDataURL(blob);
                                filesaver.readyState = filesaver.INIT;
                                return;
                            }
                            // don't create more object URLs than needed
                            if (!object_url) {
                                object_url = get_URL().createObjectURL(blob);
                            }
                            if (force) {
                                view.location.href = object_url;
                            } else {
                                var opened = view.open(object_url, "_blank");
                                if (!opened) {
                                    // Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
                                    view.location.href = object_url;
                                }
                            }
                            filesaver.readyState = filesaver.DONE;
                            dispatch_all();
                            revoke(object_url);
                        };
                    filesaver.readyState = filesaver.INIT;

                    if (can_use_save_link) {
                        object_url = get_URL().createObjectURL(blob);
                        setTimeout(function () {
                            save_link.href = object_url;
                            save_link.download = name;
                            click(save_link);
                            dispatch_all();
                            revoke(object_url);
                            filesaver.readyState = filesaver.DONE;
                        });
                        return;
                    }

                    fs_error();
                },
                FS_proto = FileSaver.prototype,
                saveAs = function (blob, name, no_auto_bom) {
                    return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
                };
            // IE 10+ (native saveAs)
            if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
                return function (blob, name, no_auto_bom) {
                    name = name || blob.name || "download";

                    if (!no_auto_bom) {
                        blob = auto_bom(blob);
                    }
                    return navigator.msSaveOrOpenBlob(blob, name);
                };
            }

            FS_proto.abort = function () {
            };
            FS_proto.readyState = FS_proto.INIT = 0;
            FS_proto.WRITING = 1;
            FS_proto.DONE = 2;

            FS_proto.error =
                FS_proto.onwritestart =
                    FS_proto.onprogress =
                        FS_proto.onwrite =
                            FS_proto.onabort =
                                FS_proto.onerror =
                                    FS_proto.onwriteend =
                                        null;

            return saveAs;
        }(
            typeof self !== "undefined" && self ||
            typeof window !== "undefined" && window ||
            this.content
        ));
        // `self` is undefined in Firefox for Android content script context
        // while `this` is nsIContentFrameMessageManager
        // with an attribute `content` that corresponds to the window

        if (typeof module !== "undefined" && module.exports) {
            module.exports.saveAs = saveAs;
        } else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
            define("FileSaver.js", function () {
                return saveAs;
            });
        }


        var file = new File([JSON.stringify(data)], "label_result.json", {
            type: "text/plain;charset=utf-8"
        });

        saveAs(file);
    }

    // 进入跳转模式
    $("#current_id_show").click(function () {
        $('#div_id_show').hide();
        $('#target_id_edit').val(current_id);
        $('#last_id_edit').html(data.length - 1);
        $('#div_id_edit').show();
    });

    $('#add_1').click(function () {
        var entity = window.getSelection().toString();
        if (entity == "") {
            alert("选中文本为空！");
            return;
        }
        if (entity in data[current_id]['name_entity'] || entity in data[current_id]['keyword_entity']) {
            alert("实体已存在！");
            return;
        }
        data[current_id]["name_entity"][entity] = 0.75;
        add_row(entity, 0, 0.75);
    });

    $('#add_2').click(function () {
        var entity = window.getSelection().toString();
        if (entity == "") {
            alert("选中文本为空！");
            return;
        }
        if (entity in data[current_id]['name_entity'] || entity in data[current_id]['keyword_entity']) {
            alert("实体已存在！");
            return;
        }
        data[current_id]["keyword_entity"][entity] = 0.75;
        add_row(entity, 1, 0.75);
    });

    // 跳转
    $('#switch_button').click(function () {
        var target_id = parseInt($('#target_id_edit').val());
        if (target_id >= 0 && target_id < data.length) {
            current_id = target_id;
            render_data(current_id);
        } else {
            alert('id的区间为[0,' + (data.length - 1) + ']');
        }
    });

    // 取消跳转
    $('#cancel_button').click(function () {
        $('#div_id_edit').hide();
        $('#current_id_show').html(current_id);
        $('#last_id_show').html(data.length - 1);
        $('#div_id_show').show();
    });

//    function render_content(){
//        var s = data[current_id]["content"]
//        var entity_set = new Set();
//        for(var key in data[current_id]["name_entity"]){
//            entity_set.add(key);
//        }
//        for(var key in data[current_id]['keyword_entity']){
//            entity_set.add(key);
//        }
//        alert(entity_set);
//        for(var key of entity_set){
//            var re = new RegExp(key, "g");
//            s.replace(re, "aaa" + key + "bbb");
//        }
//        $("#content_div").html(s);
//    }

    // 页面加载数据
    function render_data(current_id) {
        $("#title_div").text(data[current_id]["title"]);
        $("#content_div").html(data[current_id]["content"]);
        $("#current_id_show").html(current_id);
        $("#last_id_show").html(data.length - 1);
        $('#div_id_edit').hide();
        $('#div_id_show').show();

        // 清空表格
//        $("#table  tr:not(:first)").html("");

        //初始化正文实体
        if (data[current_id].hasOwnProperty('name_entity')) {
            for (var key in data[current_id]['name_entity']) {
                add_row(key, 0, data[current_id]['name_entity'][key]);
            }
        }
        if (data[current_id].hasOwnProperty("keyword_entity")) {
            for (var key in data[current_id]['keyword_entity']) {
                add_row(key, 1, data[current_id]['keyword_entity'][key]);
            }
        }
    }

    // 添加表格行
    function add_row(title_entity, entity_category, value) {
        var newtd1 = document.createElement("td");
        newtd1.innerHTML = title_entity;
        newtd1.contentEditable = true;
        newtd1.onblur = function () {
            var entity = $(this).html();
            if (edit_entity in data[current_id]['name_entity']) {
                var value = data[current_id]['name_entity'][edit_entity];
                delete data[current_id]['name_entity'][edit_entity];
                data[current_id]['name_entity'][entity] = value;
            }
            if (edit_entity in data[current_id]['keyword_entity']) {
                var value = data[current_id]['keyword_entity'][edit_entity];
                delete data[current_id]['keyword_entity'][edit_entity];
                data[current_id]['keyword_entity'][entity] = value;
            }
        }
        newtd1.onclick = function () {
            edit_entity = $(this).html();
        }

        var newtd2 = document.createElement("td");
        // var choices_text = ["公司人名实体", "关键词实体"];
        // var choices_value = [0, 1]
        // var selection = document.createElement("select");
        // for (var i = 0; i < choices_text.length; i++) {
        //     var option = document.createElement("option");
        //     option.value = choices_value[i];
        //     option.innerHTML = choices_text[i];
        //     selection.append(option);
        // }
        // selection.value = entity_category;
        if (entity_category == 0) {
            newtd2.innerHTML = "公司人名实体";
        } else if (entity_category == 1) {
            newtd2.innerHTML = "关键词实体";
        }

        var newtd2_5 = document.createElement("td");

        var newdiv = document.createElement("div");
        var radiovalue = [0.75, 0.4, 0.15];
        var radiotext = ["强相关", "弱相关", "不相关"];
        var index;
        if (value <= 0.15) {
            index = 2;
        } else if (value <= 0.4) {
            index = 1;
        } else {
            index = 0;
        }
        for (var i = 0; i < 3; i++) {
            var newinput = document.createElement("input");
            newinput.type = "radio";
            newinput.name = "correlation" + title_entity;
            newinput.value = radiovalue[i];
            newinput.class = "radio_button";
            newinput.onclick = function (obj) {
                var value = this.value;
                var title_entity = this.parentNode.parentNode.previousSibling.previousSibling.innerHTML;
                var entity_category = this.parentNode.parentNode.previousSibling.innerHTML;
                if (entity_category == "公司人名实体") {
                    entity_category = "name_entity";
                }
                if (entity_category == '关键词实体') {
                    entity_category = "keyword_entity";
                }
//                alert("(" + title_entity + ")(" + entity_category + ")");
                data[current_id][entity_category][title_entity] = value;
//                if (this.value == 0.15) {
//                    this.parentNode.parentNode.previousSibling.innerText = "0.15";
//                } else if (this.value == 0.4) {
//                    this.parentNode.parentNode.previousSibling.innerText = "0.4";
//                } else {
//                    this.parentNode.parentNode.previousSibling.innerText = "0.75";
//                }
            }
            if (i == index) {
                newinput.checked = "checked";
            }
            newdiv.append(newinput);
            newdiv.append(radiotext[i]);
        }
        newtd2_5.append(newdiv);

        var newtd3 = document.createElement("td");
        var newbutton = document.createElement("button");
        newbutton.style.border = "none";
        newbutton.innerHTML = "删除";
        newbutton.className = "deletebutton";
        newtd3.append(newbutton);

        var newtr = document.createElement("tr");
        newtr.setAttribute("class", "newadded");
        newtr.append(newtd1);
        newtr.append(newtd2);
        newtr.append(newtd2_5);
        newtr.append(newtd3);

        $("table").append(newtr);
    }

    // 删除行
    $("#table").on('click', 'button.deletebutton', function () {
        // 设置tr的class为delete
        $(this).parent().parent().attr("class", "delete");
        var current_key = $("tr.delete td:nth-child(1)").html();
        if (current_key in data[current_id]['name_entity']) {
            delete data[current_id]['name_entity'][current_key];
        }
        if (current_key in data[current_id]['keyword_entity']) {
            delete data[current_id]['keyword_entity'][current_key];
        }
        $("tr").remove(".delete");
    });

    $(document).keydown(function (event) {
//        console.log(event.keyCode);
        // a -> pre
        if (event.keyCode == 37) {
            if (current_id == 0) {
                alert("已经到头了！");
            } else {
                current_id -= 1;
                render_data(current_id);
            }
        }
        // d -> next
        if (event.keyCode == 39) {
            if (current_id == data.length - 1) {
                alert("已经到底了！");
            } else {
                //跳转到下一页
                current_id += 1;
                render_data(current_id);
            }
        }
        // w -> add 1
        if (event.keyCode == 38) {
            var entity = window.getSelection().toString();
            if (entity == "") {
                alert("选中文本为空！");
                return;
            }
            if (entity in data[current_id]['name_entity'] || entity in data[current_id]['keyword_entity']) {
                alert("实体已存在！");
                return;
            }
            data[current_id]["name_entity"][entity] = 0.75;
            add_row(entity, 0, 0.75);
        }
        // s -> add2
        if (event.keyCode == 40) {
            var entity = window.getSelection().toString();
            if (entity == "") {
                alert("选中文本为空！");
                return;
            }
            if (entity in data[current_id]['name_entity'] || entity in data[current_id]['keyword_entity']) {
                alert("实体已存在！");
                return;
            }
            data[current_id]["keyword_entity"][entity] = 0.75;
            add_row(entity, 1, 0.75);
        }
    });
});

