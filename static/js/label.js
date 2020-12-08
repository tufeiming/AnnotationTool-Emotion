let data;
let current_id = 0;


// table添加行 html语句
function getNewRow() {
    return "<tr>\n" +
        "                                <td style=\"vertical-align: middle !important;text-align: center;\">\n" +
        "                                    <select class=\"custom-select my-1 mr-sm-2\" id=\"emotion_select\">\n" +
        "                                        <option value=\"生气\" selected=\"selected\">生气</option>\n" +
        "                                        <option value=\"悲伤\">悲伤</option>\n" +
        "                                        <option value=\"厌恶\">厌恶</option>\n" +
        "                                        <option value=\"高兴\">高兴</option>\n" +
        "                                        <option value=\"害怕\">害怕</option>\n" +
        "                                        <option value=\"惊讶\">惊讶</option>\n" +
        "                                        <option value=\"喜爱\">喜爱</option>\n" +
        "                                    </select>\n" +
        "                                </td>\n" +
        "                                <td style=\"vertical-align: middle !important;text-align: center;\" id=\"clue\"\n" +
        "                                    contentEditable=\"true\"></td>\n" +
        "                                <td style=\"vertical-align: middle !important;text-align: center;\" id=\"cause\"\n" +
        "                                    contentEditable=\"true\"></td>\n" +
        "                                <td style=\"vertical-align: middle !important;text-align: center;\" nowrap=\"nowrap\">\n" +
        "                                    <button class=\"delete\" id=\"delete_row_button\">删除</button>\n" +
        "                                </td>\n" +
        "                            </tr>";
}

// 保存情绪list
function saveEmotion() {
    console.log("执行saveEmotion()函数--------------------");
    console.log("current_id=" + current_id);
    let emotion;
    let clue;
    let cause;

    //先将emotion_list清空
    data[current_id]["emotion_list"] = [];

    // 遍历table
    let trs = $("table").find("tr");
    console.log("table共有" + (trs.length - 1) + "行数据");
    for (let i = 1; i < trs.length; i++) {
        emotion = trs.eq(i).find("td").eq(0).find("#emotion_select").val();
        clue = trs.eq(i).find("td").eq(1).text();
        cause = trs.eq(i).find("td").eq(2).text();
        let addContent = '{"emotion": "' + emotion + '","clue": "' + clue + '","cause": "' + cause + '"}';
        console.log(addContent);
        data[current_id]["emotion_list"].push(eval("(" + addContent + ")"));
    }
}

$(document).ready(function () {
    $("#file_view").show();
    $("#label_view").hide();

    // 上一页响应函数
    $("#pre_button").click(function () {
        // 先保存情绪
        saveEmotion();

        if (current_id === 0) {
            alert("已经到头了！");
        } else {
            current_id -= 1;
            render_data(current_id);
        }
    });

    // 下一页响应函数
    $("#next_button").click(function () {
        // 先保存情绪
        saveEmotion();

        if (current_id === data.length - 1) {
            alert("已经到底了！");
        } else {
            //跳转到下一页
            current_id += 1;
            render_data(current_id);
        }
    });

    // 选择文件响应函数
    $("#file_input").change(function () {
        let files = $("#file_input").prop("files"); //获取到文件列表

        if (files.length === 0) {
            alert('请选择文件');
        } else {
            let reader = new FileReader(); //新建一个FileReader
            reader.readAsText(files[0], "UTF-8"); //读取文件
            reader.onload = function (evt) { //读取完文件之后会回来这里
                let fileString = evt.target.result;
                try {
                    data = JSON.parse(fileString.toString());
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
        // 先保存情绪
        saveEmotion();
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

    $("#Select1 .btn").on('click', function () {
        ToggleRadioButtons1("#Select1", $(this));
    });

    $("#Select2 .btn").on('click', function () {
        ToggleRadioButtons2("#Select2", $(this));
    });

    // 进入跳转模式
    $("#current_id_show").click(function () {
        $('#div_id_show').hide();
        $('#target_id_edit').val(current_id);
        $('#last_id_edit').html(data.length - 1);
        $('#div_id_edit').show();
    });


    // 跳转
    $('#switch_button').click(function () {
        let target_id = parseInt($('#target_id_edit').val());
        if (target_id >= 0 && target_id < data.length) {
            //保存情绪
            saveEmotion();
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


    // table添加行
    $("#add_row_button").click(function () {
        $("table").append(getNewRow());
    });

    // table删除行
    $("#emotion_table").on("click", "#delete_row_button", function () {
        $(this).parent().parent().remove();
        saveEmotion();
    });


    // 页面加载数据
    function render_data(current_id) {
        console.log("执行render_data()函数--------------------");
        console.log("current_id=" + current_id);
        $("#title_div").text(data[current_id]["title"]);
        $("#content_div").html(data[current_id]["content"].substring(0, 511));
        $("#current_id_show").html(current_id);
        $("#last_id_show").html(data.length - 1);
        $('#div_id_edit').hide();
        $('#div_id_show').show();
//        $('#refresh').hide();


        $("input[type='radio']").parent().attr("class", "btn btn-default");
        $("input[type='radio']").prev().attr("class", "glyphicon glyphicon-uncheck");

        // $("input[type='checkbox']").parent().attr("class", "btn btn-default");
        // $("input[type='checkbox']").prev().attr("class", "glyphicon glyphicon-uncheck");


        if (data[current_id]["isValid"] != "") {
            let isValid = data[current_id]['isValid'];
//           console.log(category_id)
//           console.log(typeof category_id)
            if (isValid == "是") {
                $("#yes").parent().attr("class", "btn btn-default active");
                $("#yes").prev().attr("class", "glyphicon glyphicon-check");
            } else if (isValid == "否") {
                $("#no").parent().attr("class", "btn btn-default active");
                $("#no").prev().attr("class", "glyphicon glyphicon-check");
            }
        }

        if (data[current_id]["emotion3"] != "") {
            let category_id = data[current_id]['emotion3'];
//           console.log(category_id)
//           console.log(typeof category_id)
            if (category_id === "正面") {
                $("#positive").parent().attr("class", "btn btn-default active");
                $("#positive").prev().attr("class", "glyphicon glyphicon-check");
            } else if (category_id === "负面") {
                $("#negative").parent().attr("class", "btn btn-default active");
                $("#negative").prev().attr("class", "glyphicon glyphicon-check");
            } else if (category_id === "中性") {
                $("#neutral").parent().attr("class", "btn btn-default active");
                $("#neutral").prev().attr("class", "glyphicon glyphicon-check");
            }
        }

        // 先清空
        $("#emotion_table tr:gt(0)").remove();
        // 从data中读取
        let emotionList = data[current_id]["emotion_list"];
        console.log("emotion_list.length=" + emotionList.length);
        for (let i = 0; i < emotionList.length; i++) {
            let emotion = emotionList[i]["emotion"];
            let clue = emotionList[i]["clue"];
            let cause = emotionList[i]["cause"];
            $("#emotion_table").append(getNewRow());
            let trs = $("#emotion_table").find("tr");
            trs.eq(i + 1).find("td").eq(0).find("#emotion_select").val(emotion);
            trs.eq(i + 1).find("td").eq(1).text(clue);
            trs.eq(i + 1).find("td").eq(2).text(cause);
        }
    }
});
// "use strict";
// $(document).ready(function () {
//     $("#Select1 .btn").on('click', function () {
//         ToggleRadioButtons1("#Select1", $(this));
//     });
//
//     $("#Select2 .btn").on('click', function () {
//         ToggleRadioButtons2("#Select2", $(this));
//     });
//
// });
// let timer = null;
// $(document).ready(function () {
//     $("#Select3 .btn").on('click', function () {
//         let now_id = this;
//         clearTimeout(timer);
//         timer = setTimeout(function () {
//             ToggleRadioButtons3("#Select3", $(now_id));
//         }, 200);
//     });
// });
//
// $(document).ready(function () {
//     $("#Select3 .btn").dblclick(function () {
//         clearTimeout(timer);
//         ToggleRadioButtons4("#Select3", $(this));
//     });
// });


function ToggleRadioButtons1(groupName, current) {
    console.log('有效数据筛选点击行为');
    console.log(current);
    let c = current.text().replace(/\ +/g, "");
    let d = c.replace(/[\r\n]/g, "");
    console.log(d);
    data[current_id]['isValid'] = d;
    //在当前的btn-group里先清除所有“选取”图标，全部换成“取消”样式（“初始化”）
    $(groupName + " .glyphicon-check")
        .removeClass("glyphicon-check")
        .addClass("glyphicon-unchecked");
    //alert("暂停啦");
    //更改当前用户选择的那个btn图标
    current.find(":first-child")
        .removeClass("glyphicon-unchecked")
        .addClass("glyphicon-check");


}

function ToggleRadioButtons2(groupName, current) {
//       console.log(current)
    console.log('情感产生点击行为');
    console.log(current);
    let c = current.text().replace(/\ +/g, "");
    let d = c.replace(/[\r\n]/g, "");
    console.log(d);
    data[current_id]['emotion3'] = d;
    //在当前的btn-group里先清除所有“选取”图标，全部换成“取消”样式（“初始化”）
    $(groupName + " .glyphicon-check")
        .removeClass("glyphicon-check")
        .addClass("glyphicon-unchecked");
    //alert("暂停啦");
    //更改当前用户选择的那个btn图标
    current.find(":first-child")
        .removeClass("glyphicon-unchecked")
        .addClass("glyphicon-check");


}

// function ToggleRadioButtons3(groupName, current) {
//     console.log('情绪产生点击行为');
//     console.log(current);
//     let r = current.text().replace(/\ +/g, "");
//     let s = r.replace(/[\r\n]/g, "");
//     console.log(s);
//     console.log(data[current_id]['emotion7'].indexOf(s));
//     console.log(typeof data[current_id]['emotion7'].indexOf(s));
//     if (data[current_id]['emotion7'].indexOf(s) > -1) {
//         console.log("数据已存在")
//     } else {
//         data[current_id]['emotion7'].push(s);
//         current.find(":first-child").removeClass("glyphicon-unchecked").addClass("glyphicon-check");
//
//     }
//
//     console.log("这里是保存后的数据", data[current_id]['emotion7'])
//
// }
//
// function ToggleRadioButtons4(groupName, current) {
// //        Array.prototype.indexOf=function(arr){
// //            for(let i=0;i<data[current_id]['emotion7'].length;i++){
// //                if(data[current_id]['emotion7'][i]==arr){
// //                    return i;
// //                } 
// //            }
// //        }
//     //在当前的btn-group里先清除所有“选取”图标，全部换成“取消”样式（“初始化”）
//     console.log("这里双击了");
//     console.log(current);
//     let r = current.text().replace(/\ +/g, "");
//     let s = r.replace(/[\r\n]/g, "");
//     console.log(s);
//     // 要删除的index
//     let de_index = data[current_id]['emotion7'].indexOf(s);
//     console.log("这里是位置", de_index);
//     // 从emotion7中删除该情绪
//     data[current_id]['emotion7'].splice(de_index, 1);
//     current.find(":first-child").removeClass("glyphicon-check").addClass("glyphicon-unchecked");
//     current.removeClass("btn btn-default active").addClass("btn btn-default");
// }


