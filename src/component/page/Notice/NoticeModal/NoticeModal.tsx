import { NoticeModalStyled } from "./styled";
import { useRecoilState } from "recoil";
import { useEffect, FC, useState, useRef, ChangeEvent } from "react";
import { modalState } from "../../../../stores/modalState";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { loginInfoState } from "../../../../stores/userInfo";
import noImage from "../../../../assets/noImage.jpg";

export interface INoticeModalProps {
    noticeSeq?: number;
    onSuccess: () => void; // return 값이 없는 타입
    handlerModal: () => void;
    setNoticeSeq: (noticeSeq: undefined) => void; // undefined 타입만 받겠다.
}

export interface INoticeDetail {
    file_ext: string | null;
    file_name: string | null;
    file_size: number | null;
    logical_path: string | null;
    loginID: string;
    noti_content: string;
    noti_date: string;
    noti_seq: number;
    noti_title: string;
    phsycal_path: string | null;
}

export interface INoticeDetailResponse {
    detailValue: INoticeDetail;
}

export interface IPostResponse {
    result: string;
}

// FC: props의 타입을 지정해 줄 수 있음
export const NoticeModal: FC<INoticeModalProps> = ({ noticeSeq, onSuccess, setNoticeSeq }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [noticeDetail, setNoticeDetail] = useState<INoticeDetail>();
    const [userInfo] = useRecoilState(loginInfoState);
    const title = useRef<HTMLInputElement>(null);
    const content = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState<string>("notImage");
    const [fileData, setFileData] = useState<File>();

    useEffect(() => {
        if (noticeSeq) searchDetail(); // 등록과 조회 분리

        return () => {
            setNoticeSeq(undefined); // 수정을 했을 때 초기화
        };
    }, []);

    const searchDetail = () => {
        axios.post("/board/noticeDetail.do", { noticeSeq }).then((res: AxiosResponse<INoticeDetailResponse>) => {
            if (res.data.detailValue) setNoticeDetail(res.data.detailValue);
            const fileExt = res.data.detailValue.file_ext;
            if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
                setImageUrl(res.data.detailValue.logical_path || noImage);
            } else {
                setImageUrl("notImage");
            }
        });
    };

    /*
    const handlerSave = () => {
        axios
            .post("/board/noticeSave.do", {
                title: title.current?.value,
                content: content.current?.value,
                loginID: userInfo.loginId,
            })
            .then((res: AxiosResponse<IPostResponse>) => {
                if (res.data.result === "success") {
                    //setModal(!modal);
                    onSuccess();
                }
            });
    };
    */

    const handlerSave = () => {
        const fileForm = new FormData();
        const textData = {
            title: title.current?.value,
            content: content.current?.value,
            loginId: userInfo.loginId,
        };

        // text 데이터와 file 데이터를 따로 분리해서 보냄
        if (fileData) {
            fileForm.append("file", fileData);
            fileForm.append("text", new Blob([JSON.stringify(textData)], { type: "application/json" }));
            axios.post("/board/noticeFileSaveJson", fileForm).then((res: AxiosResponse<IPostResponse>) => {
                // success 만 가능하게 제한
                if (res.data.result === "success") {
                    onSuccess();
                }
            });
        }
    };

    // const handlerUpdate = () => {
    //     axios
    //         .post("/board/noticeUpdate.do", {
    //             title: title.current?.value,
    //             content: content.current?.value,
    //             noticeSeq: noticeSeq,
    //         })
    //         .then((res: AxiosResponse<IPostResponse>) => {
    //             // success 만 가능하게 제한
    //             if (res.data.result === "success") {
    //                 onSuccess();
    //             }
    //         });
    // };

    const handlerUpdate = () => {
        const fileForm = new FormData();
        const textData = {
            title: title.current?.value,
            content: content.current?.value,
            loginId: userInfo.loginId,
            noticeSeq,
        };

        // text 데이터와 file 데이터를 따로 분리해서 보냄
        if (fileData) {
            fileForm.append("file", fileData);
            fileForm.append("text", new Blob([JSON.stringify(textData)], { type: "application/json" }));
            axios.post("/board/noticeFileUpdateJson", fileForm).then((res: AxiosResponse<IPostResponse>) => {
                // success 만 가능하게 제한
                if (res.data.result === "success") {
                    onSuccess();
                }
            });
        }
    };

    // 파일 미리보기
    const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fileInfo = e.target.files;
        console.log(fileInfo?.length);
        if (fileInfo?.length) {
            const fileInfoSplit = fileInfo[0].name.split(".");
            const fileExtension = fileInfoSplit[1].toLowerCase();
            console.log(fileInfoSplit);
            console.log(fileExtension);

            if (fileExtension === "jpg" || fileExtension === "gif" || fileExtension === "png") {
                setImageUrl(URL.createObjectURL(fileInfo[0]));
            } else {
                setImageUrl("notImage");
            }
            setFileData(fileInfo[0]);
        }
    };

    const handlerDelete = () => {
        axios
            .post("/board/noticeDelete.do", {
                noticeSeq: noticeSeq,
            })
            .then((res: AxiosResponse<IPostResponse>) => {
                // success 만 가능하게 제한
                if (res.data.result === "success") {
                    onSuccess();
                }
            });
    };

    const downLoadFile = async () => {
        let param = new URLSearchParams();
        param.append("noticeSeq", noticeSeq?.toString() as string);

        const postAction: AxiosRequestConfig = {
            url: "/board/noticeDownload.do",
            method: "POST",
            data: param,
            responseType: "blob",
        };

        await axios(postAction).then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a"); // a태그가 가지고 있는 속성으로 다운로드
            link.href = url;
            link.setAttribute("download", noticeDetail?.file_name as string);
            document.body.appendChild(link);
            link.click();

            link.remove();
        });
    };

    return (
        <NoticeModalStyled>
            <div className="container">
                <label>
                    제목 :<input type="text" defaultValue={noticeDetail?.noti_title} ref={title}></input>
                </label>
                <label>
                    내용 : <input type="text" defaultValue={noticeDetail?.noti_content} ref={content}></input>
                </label>
                파일: <input type="file" id="fileInput" style={{ display: "none" }} onChange={handlerFile}></input>
                <label className="img-label" htmlFor="fileInput">
                    파일 첨부하기
                </label>
                <div onClick={downLoadFile}>
                    {imageUrl === "notImage" ? (
                        <div>
                            <label>파일명</label>
                            {fileData?.name || noticeDetail?.file_name}
                        </div>
                    ) : (
                        <div>
                            <label>미리보기</label>
                            <img src={imageUrl} />
                        </div>
                    )}
                </div>
                <div className={"button-container"}>
                    <button onClick={noticeSeq ? handlerUpdate : handlerSave}>{noticeSeq ? "수정" : "등록"}</button>
                    {noticeSeq ? <button onClick={handlerDelete}>삭제</button> : null}

                    <button onClick={() => setModal(!modal)}>나가기</button>
                </div>
            </div>
        </NoticeModalStyled>
    );
};
