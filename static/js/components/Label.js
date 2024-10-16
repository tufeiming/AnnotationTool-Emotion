import React, { useState, useEffect } from 'react';

const Label = () => {
    const [data, setData] = useState([]);
    const [currentId, setCurrentId] = useState(0);

    const displayEmotionPrompt = (id) => {
        console.log(`当前id：${id}`);
        document.getElementById("emotion_prompt").style.display = "block";
        const emotionPromptContent = document.getElementById("emotion_prompt_content");
        switch (id) {
            case "anger_label":
                emotionPromptContent.textContent = "生气的常见划分有：愤怒、愤恨、不平。判断生气时，可以先找情绪词，例如令人气愤，生气等。";
                break;
            case "sadness_label":
                emotionPromptContent.textContent = "悲伤的常见划分有：忧伤、悲痛、自怜、失望、惋惜、沮丧、寂寞、无奈、愧疚、懊悔、思念。";
                break;
            case "disgust_label":
                emotionPromptContent.textContent = "厌恶的常见划分有：轻蔑、讥讽、抗拒、烦躁、反感、嫉妒、怀疑。厌恶要有对应的对象，当厌恶变得强烈，逼近个人利益时，人就会产生想要消灭以保护自己利益的欲望，情绪就转化为了愤怒。";
                break;
            case "happiness_label":
                emotionPromptContent.textContent = "高兴的常见划分有：高兴、开心、满足、幸福、骄傲、快乐、兴奋、狂喜。判断高兴时，可以先找情绪词，如开心，愉快，拟声词、表情标签等。";
                break;
            case "fear_label":
                emotionPromptContent.textContent = "害怕的常见划分有：焦虑、惊恐、紧张、担忧、疑虑、恐慌、羞耻、害羞。害怕有对应的主体或对象。";
                break;
            case "surprise_label":
                emotionPromptContent.textContent = "惊讶的常见划分有：疑惑、震惊、讶异、惊喜、尴尬。惊讶表示的情感倾向也有正面和负面，需要结合全文本考虑。";
                break;
            case "love_label":
                emotionPromptContent.textContent = "喜爱的常见划分有：喜爱、赞美、鼓励、友善、信赖、亲密、挚爱。同时，喜爱要有对应的对象，当喜爱变得强烈，涉及个人利益时，情绪就转变成高兴。";
                break;
            default:
                break;
        }
    };

    const hideEmotionPrompt = () => {
        console.log("鼠标离开");
        document.getElementById("emotion_prompt").style.display = "none";
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length === 0) {
            alert('请选择文件');
            return;
        }

        const reader = new FileReader();
        reader.readAsText(files[0], "UTF-8");
        reader.onload = (evt) => {
            const fileString = evt.target.result;
            try {
                const fileData = JSON.parse(fileString);
                console.log(`导入数据成功，共有${fileData.length}条数据!`);
                setData(fileData);
                setCurrentId(0);

                if (fileData[0].hasOwnProperty("finished")) {
                    setCurrentId(fileData[0]['finished']);
                }
                renderData(fileData[0]['finished']);
            } catch (err) {
                alert(`解析json文件报错！\n${err.message}`);
            }
        };
    };

    const renderData = (currentId) => {
        console.log(`current_id: ${currentId}`);
        document.getElementById("title_div").textContent = data[currentId]["title"];
        document.getElementById("content_div").innerHTML = data[currentId]["content"].substring(0, 511);
        document.getElementById("current_id_show").textContent = currentId;
        document.getElementById("last_id_show").textContent = data.length - 1;
        document.getElementById("div_id_show").style.display = "block";

        const radioButtons = document.querySelectorAll("input[type='radio']");
        radioButtons.forEach((radio) => {
            radio.parentElement.className = "btn btn-default";
            radio.previousElementSibling.className = "glyphicon glyphicon-uncheck";
        });

        const checkboxes = document.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach((checkbox) => {
            checkbox.parentElement.className = "btn btn-default";
            checkbox.previousElementSibling.className = "glyphicon glyphicon-uncheck";
        });

        if (data[currentId]["isValid"] !== "") {
            const isValid = data[currentId]["isValid"];
            if (isValid === "是") {
                document.getElementById("yes").parentElement.className = "btn btn-default active";
                document.getElementById("yes").previousElementSibling.className = "glyphicon glyphicon-check";
            } else if (isValid === "否") {
                document.getElementById("no").parentElement.className = "btn btn-default active";
                document.getElementById("no").previousElementSibling.className = "glyphicon glyphicon-check";
            }
        }

        if (data[currentId]["emotion3"] !== "") {
            const emotion3 = data[currentId]["emotion3"];
            if (emotion3 === "正面") {
                document.getElementById("positive").parentElement.className = "btn btn-default active";
                document.getElementById("positive").previousElementSibling.className = "glyphicon glyphicon-check";
            } else if (emotion3 === "负面") {
                document.getElementById("negative").parentElement.className = "btn btn-default active";
                document.getElementById("negative").previousElementSibling.className = "glyphicon glyphicon-check";
            } else if (emotion3 === "中性") {
                document.getElementById("neutral").parentElement.className = "btn btn-default active";
                document.getElementById("neutral").previousElementSibling.className = "glyphicon glyphicon-check";
            }
        }

        data[currentId]["emotion7"].forEach((emotion) => {
            if (emotion !== "") {
                const emotionElement = document.getElementById(emotion);
                emotionElement.parentElement.className = "btn btn-default active";
                emotionElement.previousElementSibling.className = "glyphicon glyphicon-check";
            }
        });
    };

    const handlePreButtonClick = () => {
        if (currentId === 0) {
            alert("已经到头了！");
        } else {
            setCurrentId(currentId - 1);
            renderData(currentId - 1);
        }
    };

    const handleNextButtonClick = () => {
        if (currentId === data.length - 1) {
            alert("已经到底了！");
        } else {
            setCurrentId(currentId + 1);
            renderData(currentId + 1);
        }
    };

    const handleSaveButtonClick = () => {
        data[0]['finished'] = currentId;
        save();
    };

    const save = () => {
        const saveAs = (blob, name) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        };

        const file = new Blob([JSON.stringify(data)], { type: "text/plain;charset=utf-8" });
        saveAs(file, "label_result.json");
    };

    useEffect(() => {
        const emotionLabels = document.querySelectorAll("label[name='emotion_label']");
        emotionLabels.forEach((label) => {
            label.addEventListener("mouseenter", () => displayEmotionPrompt(label.id));
            label.addEventListener("mouseleave", hideEmotionPrompt);
        });

        document.getElementById("file_input").addEventListener("change", handleFileChange);
        document.getElementById("pre_button").addEventListener("click", handlePreButtonClick);
        document.getElementById("next_button").addEventListener("click", handleNextButtonClick);
        document.getElementById("save_button").addEventListener("click", handleSaveButtonClick);

        return () => {
            emotionLabels.forEach((label) => {
                label.removeEventListener("mouseenter", () => displayEmotionPrompt(label.id));
                label.removeEventListener("mouseleave", hideEmotionPrompt);
            });

            document.getElementById("file_input").removeEventListener("change", handleFileChange);
            document.getElementById("pre_button").removeEventListener("click", handlePreButtonClick);
            document.getElementById("next_button").removeEventListener("click", handleNextButtonClick);
            document.getElementById("save_button").removeEventListener("click", handleSaveButtonClick);
        };
    }, []);

    return (
        <div>
            <div id="file_view" style={{ textAlign: "center", marginTop: "20px" }}>
                <h3>选择文件</h3>
                <input type="file" id="file_input" />
            </div>
            <div id="label_view" style={{ display: "none", marginTop: "20px" }}>
                <div className="row clearfix text-center" style={{ marginBottom: "20px", fontSize: "25px" }}>
                    <div id="div_id_show">
                        <span id="current_id_show" className="text-info"></span>
                        <span className="text-primary">/</span>
                        <span id="last_id_show" className="text-info"></span>
                    </div>
                </div>
                <div className="row clearfix">
                    <div className="col-md-6 column">
                        <div className="panel panel-info">
                            <div className="panel-heading">
                                <h3 className="panel-title" id="title_div"></h3>
                            </div>
                            <div style={{ height: "600px", border: "none", overflowY: "auto" }}>
                                <div id="content_div"></div>
                                <hr />
                                <div id="emotion_prompt" style={{ display: "none" }}>
                                    <h3 className="text-center">提示</h3>
                                    <div id="emotion_prompt_content"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 column">
                        <div className="panel panel-info">
                            <div className="panel-heading">
                                <h3 className="panel-title">标注面板 <span className="glyphicon glyphicon-question-sign" id="question" data-toggle="modal" data-target="#myModal"></span></h3>
                            </div>
                        </div>
                        <div className="container body-content">
                            <div className="row" style={{ marginBottom: "20px", width: "400px", marginLeft: "80px" }}>
                                <div className="text-center col-xs-12">
                                    <h3>是否有效数据？</h3>
                                    <div className="well well-sm">
                                        <div className="btn-group" data-toggle="buttons" id="Select1">
                                            <label className="btn btn-default">
                                                <span className="glyphicon glyphicon-unchecked"></span>
                                                <input type="radio" name="is_valid" id="yes" value="yes" /> 是
                                            </label>
                                            <label className="btn btn-default">
                                                <span className="glyphicon glyphicon-unchecked"></span>
                                                <input type="radio" name="is_valid" id="no" value="no" /> 否
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container body-content">
                            <div className="row" style={{ marginBottom: "20px", width: "400px", marginLeft: "80px" }}>
                                <div className="text-center col-xs-12">
                                    <h3>情感极性</h3>
                                    <div className="well well-sm">
                                        <div className="btn-group" data-toggle="buttons" id="Select2">
                                            <label className="btn btn-default">
                                                <span className="glyphicon glyphicon-unchecked"></span>
                                                <input type="radio" name="emotion" id="positive" value="positive" /> 正面
                                            </label>
                                            <label className="btn btn-default">
                                                <span className="glyphicon glyphicon-unchecked"></span>
                                                <input type="radio" name="emotion" id="negative" value="negative" /> 负面
                                            </label>
                                            <label className="btn btn-default">
                                                <span className="glyphicon glyphicon-unchecked"></span>
                                                <input type="radio" name="emotion" id="neutral" value="neutral" /> 中性
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container body-content">
                            <div className="row" style={{ marginBottom: "20px", width: "600px" }}>
                                <div className="text-center col-xs-12">
                                    <h3>情绪类别</h3>
                                    <div className="well well-sm">
                                        <div className="btn-group" data-toggle="buttons" id="Select3">
                                            <label className="btn btn-default" name="emotion_label" id="anger_label">
                                                <span className="glyphicon glyphicon-unchecked"></span>
                                                <input type="checkbox" name="emotion" id="anger" value="1" /> 生气
                                            </label>
                                            <label className="btn btn-default" name="emotion_label" id="sadness_label">
                                                <span className="glyphicon glyphicon-unchecked"></span>
                                                <input type="checkbox" name="emotion" id="sadness" value="2" /> 悲伤
                                            </label>
                                            <label className="btn btn-default" name="emotion_label" id="disgust_label">
                                                <span className="glyphicon glyphicon-unchecked"></span>
                                                <input type="checkbox" name="emotion" id="disgust" value="3" /> 厌恶
                                            </label>
                                            <label className="btn btn-default" name="emotion_label" id="happiness_label">
                                                <span className="glyphicon glyphicon-unchecked"></span>
                                                <input type="checkbox" name="emotion" id="happiness" value="4" /> 高兴
                                            </label>
                                            <label className="btn btn-default" name="emotion_label" id="fear_label">
                                                <span className="glyphicon glyphicon-unchecked"></span>
                                                <input type="checkbox" name="emotion" id="fear" value="5" /> 害怕
                                            </label>
                                            <label className="btn btn-default" name="emotion_label" id="surprise_label">
                                                <span className="glyphicon glyphicon-unchecked"></span>
                                                <input type="checkbox" name="emotion" id="surprise" value="6" /> 惊讶
                                            </label>
                                            <label className="btn btn-default" name="emotion_label" id="love_label">
                                                <span className="glyphicon glyphicon-unchecked"></span>
                                                <input type="checkbox" name="emotion" id="love" value="7" /> 喜爱
                                            </label>
                                            <label className="btn btn-default">
                                                <span className="glyphicon glyphicon-unchecked"></span>
                                                <input type="checkbox" name="emotion" id="none" value="0" /> 其他
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-info" id="pre_button">上一个</button>
                            <button className="btn btn-info" id="save_button">导出标注结果</button>
                            <button className="btn btn-info" id="next_button">下一个</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Label;
