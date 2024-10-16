import React, { useState, useEffect } from 'react';

const Check = () => {
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const [data, setData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [diffId, setDiffId] = useState([]);

    const readFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = (event) => {
                try {
                    const fileData = JSON.parse(event.target.result);
                    console.log(`导入文件${file.name}成功，大小为${fileData.length}`);
                    console.log(fileData);
                    resolve(fileData);
                } catch (error) {
                    alert(`解析json文件报错！\n${error.message}`);
                    reject(error);
                }
            };
        });
    };

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
        if (files.length !== 2) {
            alert("请选择2个文件");
            return;
        }

        Promise.all([readFile(files[0]), readFile(files[1])])
            .then((results) => {
                const data1Copy = JSON.parse(JSON.stringify(results[0]));
                const data2Copy = JSON.parse(JSON.stringify(results[1]));
                const dataCopy = JSON.parse(JSON.stringify(results[0]));

                const diffIdCopy = [];
                for (let i = 0; i < results[0].length; i++) {
                    if (results[0][i]["isValid"] !== results[1][i]["isValid"] ||
                        results[0][i]["emotion3"] !== results[1][i]["emotion3"] ||
                        results[0][i]["emotion7"].sort().toString() !== results[1][i]["emotion7"].sort().toString()) {
                        diffIdCopy.push(i);
                        dataCopy[i]["isValid"] = "";
                        dataCopy[i]["emotion3"] = "";
                        dataCopy[i]["emotion7"] = [];
                    }
                }

                if (diffIdCopy.length === 0) {
                    alert("两个文件完全相同");
                    return;
                }

                console.log(`diffId大小为：${diffIdCopy.length}`);
                console.log(diffIdCopy);
                console.log(dataCopy);

                setData1(data1Copy);
                setData2(data2Copy);
                setData(dataCopy);
                setDiffId(diffIdCopy);
                setCurrentIndex(0);

                document.getElementById("file_view").style.display = "none";
                document.getElementById("label_view").style.display = "block";
                document.getElementById("file1_name").textContent = files[0].name;
                document.getElementById("file2_name").textContent = files[1].name;

                renderData(diffIdCopy[0]);
            });
    };

    const renderData = (currentId) => {
        console.log(`current_id: ${currentId}`);
        document.getElementById("title_div").textContent = data[currentId]["title"];
        document.getElementById("content_div").innerHTML = data[currentId]["content"].substring(0, 511);
        document.getElementById("current_id_show").textContent = currentIndex;
        document.getElementById("last_id_show").textContent = diffId.length - 1;
        document.getElementById("actual_id_show").textContent = diffId[currentIndex];
        document.getElementById("div_id_show").style.display = "block";

        document.getElementById("file1_isValid").textContent = data1[currentId]["isValid"];
        document.getElementById("file1_emotion3").textContent = data1[currentId]["emotion3"];
        document.getElementById("file1_emotion7").textContent = data1[currentId]["emotion7"].toString();

        document.getElementById("file2_isValid").textContent = data2[currentId]["isValid"];
        document.getElementById("file2_emotion3").textContent = data2[currentId]["emotion3"];
        document.getElementById("file2_emotion7").textContent = data2[currentId]["emotion7"].toString();

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
        if (currentIndex === 0) {
            alert("已经到头了！");
        } else {
            setCurrentIndex(currentIndex - 1);
            renderData(diffId[currentIndex - 1]);
        }
    };

    const handleNextButtonClick = () => {
        if (currentIndex === diffId.length - 1) {
            alert("已经到底了！");
        } else {
            setCurrentIndex(currentIndex + 1);
            renderData(diffId[currentIndex + 1]);
        }
    };

    const handleSaveButtonClick = () => {
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
                <h3>选择文件<span className="text-warning">（请务必选择同一份语料的两个标注结果）</span></h3>
                <input type="file" id="file_input" multiple />
            </div>
            <div id="label_view" style={{ display: "none", marginTop: "20px" }}>
                <div className="row clearfix text-center" style={{ marginBottom: "20px", fontSize: "25px" }}>
                    <div id="div_id_show">
                        <span id="current_id_show" className="text-info"></span>
                        <span className="text-primary">/</span>
                        <span id="last_id_show" className="text-info"></span>(
                        <span id="actual_id_show" className="text-info"></span>)
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
                                <div>
                                    <h4 id="file1_name"></h4>
                                    <div>是否有效数据：<span id="file1_isValid" className="text-info"></span></div>
                                    <div>情感极性：<span id="file1_emotion3" className="text-info"></span></div>
                                    <div>情绪类别：<span id="file1_emotion7" className="text-info"></span></div>
                                </div>
                                <div>
                                    <h4 id="file2_name"></h4>
                                    <div>是否有效数据：<span id="file2_isValid" className="text-info"></span></div>
                                    <div>情感极性：<span id="file2_emotion3" className="text-info"></span></div>
                                    <div>情绪类别：<span id="file2_emotion7" className="text-info"></span></div>
                                </div>
                                <hr />
                                <div className="text-center">
                                    <div className="btn-group" data-toggle="buttons" id="agree">
                                        <label className="btn btn-default">
                                            <span className="glyphicon glyphicon-unchecked"></span>
                                            <input type="radio" name="agree" id="agree1" value="0" /> 赞成第一个
                                        </label>
                                        <label className="btn btn-default">
                                            <span className="glyphicon glyphicon-unchecked"></span>
                                            <input type="radio" name="agree" id="agree2" value="1" /> 赞成第二个
                                        </label>
                                    </div>
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

export default Check;
