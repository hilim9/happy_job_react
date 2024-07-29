import { NoticeModalStyled } from "./styled";
import { useRecoilState } from "recoil";
import { useEffect, FC, useState } from "react";
import { modalState } from "../../../../stores/modalState";
import axios, { AxiosResponse } from "axios";

export interface INoticeModalProps {
    noticeSeq?: number;
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

// FC: props의 타입을 지정해 줄 수 있음
export const NoticeModal: FC<INoticeModalProps> = ({ noticeSeq }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [noticeDetail, setNoticeDetail] = useState<INoticeDetail>();

    useEffect(() => {
        searchDetail();
    }, []);

    const searchDetail = () => {
        axios.post("/board/noticeDetail.do", { noticeSeq }).then((res: AxiosResponse<INoticeDetailResponse>) => {
            setNoticeDetail(res.data.detailValue);
        });
        console.log(noticeDetail);
    };
    return (
        <NoticeModalStyled>
            <div className="container">
                <label>
                    제목 :<input type="text" defaultValue={noticeDetail?.noti_title}></input>
                </label>
                <label>
                    내용 : <input type="text" defaultValue={noticeDetail?.noti_content}></input>
                </label>
                <div className={"button-container"}>
                    <button>등록</button>
                    <button>삭제</button>

                    <button onClick={() => setModal(!modal)}>나가기</button>
                </div>
            </div>
        </NoticeModalStyled>
    );
};
