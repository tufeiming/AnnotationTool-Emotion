var qa_pairs;
var current_id = 0;

$(document).ready(function() {
	$("#file_view").show();
	$("#label_view").hide();

	$("button.btn.btn-default").click(function() {
		if (window.getSelection().toString() == "") {
			alert("选中文本为空！");
		} else {
			var newtd1 = document.createElement("td");
			newtd1.innerHTML = this.innerHTML;

			var newtd2 = document.createElement("td");
			newtd2.innerHTML = window.getSelection().toString();

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
			newtr.append(newtd3);

			$("table").append(newtr);

			var temp = [newtd1.innerHTML, newtd2.innerHTML];
			if (qa_pairs[current_id].hasOwnProperty("labels") == true) {
				qa_pairs[current_id].labels.push(temp);
			} else {
				qa_pairs[current_id].labels = [temp];
			}
		}
	});

	$("#table").on('click', 'button.deletebutton', function() {
		$(this).parent().parent().attr("class", "delete");
		var current_key = $("tr.delete td:nth-child(1)").html();
		var current_value = $("tr.delete td:nth-child(2)").html();
		var temp = [current_key, current_value];
		var i;
		for (i = 0; i < qa_pairs[current_id].labels.length; i++) {
			if (qa_pairs[current_id].labels[i][0] == current_key && qa_pairs[current_id].labels[i][1] == current_value) {
				break;
			}
		}
		qa_pairs[current_id].labels.splice(i, 1);
		$("tr").remove(".delete");
	});

	$("#pre_button").click(function() {
		if (current_id == 0) {
			alert("已经到头了！");
		} else {
			current_id -= 1;
			$("#question_div").html(qa_pairs[current_id]["question"]);
			$("#answer_div").html(qa_pairs[current_id]["answer"]);
			$("#id_div").html("问答对" + current_id);

			$("tr.newadded").remove();
			$("#question_type").val("无");
			$("#relation_type").val("无");

			if (qa_pairs[current_id].hasOwnProperty("question_type") == true) {
				$("#question_type").val(qa_pairs[current_id].question_type);
			}

			if (qa_pairs[current_id].hasOwnProperty("relation_type") == true){
				$("#relation_type").val(qa_pairs[current_id].relation_type);
			}
			
			if (qa_pairs[current_id].hasOwnProperty("labels") == true) {
				for (var i=0;i<qa_pairs[current_id].labels.length;i++){
					var newtr = document.createElement("tr");
					newtr.setAttribute("class", "newadded");

					var newtd1 = document.createElement("td");
					newtd1.innerHTML = qa_pairs[current_id].labels[i][0];
					newtr.append(newtd1);

					var newtd2 = document.createElement("td");
					newtd2.innerHTML = qa_pairs[current_id].labels[i][1];
					newtr.append(newtd2);

					var newtd3 = document.createElement("td");
					var newbutton = document.createElement("button");
					newbutton.style.border = "none";
					newbutton.innerHTML = "删除";
					newbutton.className = "deletebutton";
					newtd3.append(newbutton);
					newtr.append(newtd3);

					$("#table").append(newtr);
				}
			}
		}
	});

	$("#next_button").click(function() {
		if (current_id == qa_pairs.length - 1) {
			alert("已经到底了！");
		} else {
			//跳转到下一页
			current_id += 1;

			//初始化
			$("#question_div").html(qa_pairs[current_id]["question"]);
			$("#answer_div").html(qa_pairs[current_id]["answer"]);
			$("#id_div").html("问答对" + current_id);

			$("tr.newadded").remove();
			$("#question_type").val("无");
			$("#relation_type").val("无");
			
			if (qa_pairs[current_id].hasOwnProperty("question_type") == true) {
				$("#question_type").val(qa_pairs[current_id].question_type);
			}
			if (qa_pairs[current_id].hasOwnProperty("relation_type") == true) {
				$("#relation_type").val(qa_pairs[current_id].relation_type);
			}
			if (qa_pairs[current_id].hasOwnProperty("labels") == true) {
				for (var i=0;i<qa_pairs[current_id].labels.length;i++){
					var newtr = document.createElement("tr");
					newtr.setAttribute("class", "newadded");

					var newtd1 = document.createElement("td");
					newtd1.innerHTML = qa_pairs[current_id].labels[i][0];
					newtr.append(newtd1);

					var newtd2 = document.createElement("td");
					newtd2.innerHTML = qa_pairs[current_id].labels[i][1];
					newtr.append(newtd2);

					var newtd3 = document.createElement("td");
					var newbutton = document.createElement("button");
					newbutton.style.border = "none";
					newbutton.innerHTML = "删除";
					newbutton.className = "deletebutton";
					newtd3.append(newbutton);
					newtr.append(newtd3);

					$("#table").append(newtr);
				}
			}
		}
	});

	$("#question_type").change(function() {
		var value = $("#question_type").val();
		if(value == "无" && qa_pairs[current_id].hasOwnProperty("question_type")){
			delete qa_pairs[current_id]["question_type"];
		}else {
			qa_pairs[current_id].question_type = value;
		}
	});

	$("#relation_type").change(function() {
		var value = $("#relation_type").val();
		if(value == "无" && qa_pairs[current_id].hasOwnProperty("relation_type")){
			delete qa_pairs[current_id]["relation_type"];
		}else{
			qa_pairs[current_id].relation_type = value;
		}
	});

	$("#file_input").change(function() {
		var files = $("#file_input").prop("files"); //获取到文件列表

		if (files.length == 0) {
			alert('请选择文件');
			return;
		} else {
			var reader = new FileReader(); //新建一个FileReader
			reader.readAsText(files[0], "UTF-8"); //读取文件 
			reader.onload = function(evt) { //读取完文件之后会回来这里
				var fileString = evt.target.result;
				try {
					qa_pairs = JSON.parse(fileString);
					alert("导入数据成功，共有" + qa_pairs.length + "个问答对!");
					$("#file_view").hide();
					$("#label_view").show();
					current_id = 0;
					$("#question_div").html(qa_pairs[current_id]["question"]);
					$("#answer_div").html(qa_pairs[current_id]["answer"]);
					$("#id_div").html("问答对" + current_id);
				} catch (err) {
					alert("解析json文件报错！\n" + err.message);
				}
			}
		}
	});


	$("#save_button").click(function() {
		var saveAs = saveAs || (function(view) {
			"use strict";
			// IE <10 is explicitly unsupported
			if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
				return;
			}
			var
				doc = view.document
				// only get URL when necessary in case Blob.js hasn't overridden it yet
				,
				get_URL = function() {
					return view.URL || view.webkitURL || view;
				},
				save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"),
				can_use_save_link = "download" in save_link,
				click = function(node) {
					var event = new MouseEvent("click");
					node.dispatchEvent(event);
				},
				is_safari = /constructor/i.test(view.HTMLElement) || view.safari,
				is_chrome_ios = /CriOS\/[\d]+/.test(navigator.userAgent),
				throw_outside = function(ex) {
					(view.setImmediate || view.setTimeout)(function() {
						throw ex;
					}, 0);
				},
				force_saveable_type = "application/octet-stream"
				// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
				,
				arbitrary_revoke_timeout = 1000 * 40 // in ms
				,
				revoke = function(file) {
					var revoker = function() {
						if (typeof file === "string") { // file is an object URL
							get_URL().revokeObjectURL(file);
						} else { // file is a File
							file.remove();
						}
					};
					setTimeout(revoker, arbitrary_revoke_timeout);
				},
				dispatch = function(filesaver, event_types, event) {
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
				auto_bom = function(blob) {
					// prepend BOM for UTF-8 XML and text/* types (including HTML)
					// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
					if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
						return new Blob([String.fromCharCode(0xFEFF), blob], {
							type: blob.type
						});
					}
					return blob;
				},
				FileSaver = function(blob, name, no_auto_bom) {
					if (!no_auto_bom) {
						blob = auto_bom(blob);
					}
					// First try a.download, then web filesystem, then object URLs
					var
						filesaver = this,
						type = blob.type,
						force = type === force_saveable_type,
						object_url, dispatch_all = function() {
							dispatch(filesaver, "writestart progress write writeend".split(" "));
						}
						// on any filesys errors revert to saving with object URLs
						,
						fs_error = function() {
							if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
								// Safari doesn't allow downloading of blob urls
								var reader = new FileReader();
								reader.onloadend = function() {
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
						setTimeout(function() {
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
				saveAs = function(blob, name, no_auto_bom) {
					return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
				};
			// IE 10+ (native saveAs)
			if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
				return function(blob, name, no_auto_bom) {
					name = name || blob.name || "download";

					if (!no_auto_bom) {
						blob = auto_bom(blob);
					}
					return navigator.msSaveOrOpenBlob(blob, name);
				};
			}

			FS_proto.abort = function() {};
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
			define("FileSaver.js", function() {
				return saveAs;
			});
		}
		var file = new File([JSON.stringify(qa_pairs)], "标注结果.json", {
			type: "text/plain;charset=utf-8"
		});
		saveAs(file);
	});
});
