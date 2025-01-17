import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { NoticeModal } from "../NoticeModal/NoticeModal";
import { Protal } from "../../../common/potal/Portal";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";

export interface INoticeList {
    file_ext: string;
    file_name: string;
    file_size: number;
    logical_path: string;
    loginID: string;
    noti_content: string;
    noti_date: string;
    noti_seq: number;
    noti_title: string;
    phsycal_path: string;
}

export interface INoticeListJsonResponse {
    listCount: number;
    noticeList: INoticeList[];
}

export const NoticeMain = () => {
    const { search } = useLocation(); // notice 컴포넌트가 열렸을 때 바로 실행
    const [noticeList, setNoticeList] = useState<INoticeList[]>([]);
    const [listCount, setListCount] = useState<number>(0);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [notiSeq, setNotiSeq] = useState<number>();
    const [currentParam, setCurrentParam] = useState<number | undefined>();

    useEffect(() => {
        searchNoticeList();
    }, [search]);

    const searchNoticeList = (cpage?: number) => {
        cpage = cpage || 1;
        const searchParam = new URLSearchParams(search);

        searchParam.append("cpage", cpage.toString());
        searchParam.append("pageSize", "5");

        axios.post(`/board/noticeListJson.do`, searchParam).then((res: AxiosResponse<INoticeListJsonResponse>) => {
            setNoticeList(res.data.noticeList);
            setListCount(res.data.listCount);
            setCurrentParam(cpage);
        });
    };

    // ?: 존재여부. 있으면 타입은 number이다
    const handlerModal = (seq?: number) => {
        setNotiSeq(seq);
        setModal(!modal);
    };

    const postSuccess = () => {
        // 등록이 성공했을 때 리스트 다시 검색
        setModal(!modal);
        searchNoticeList();
    };

    return (
        <>
            총 개수 : {listCount} 현재 페이지 : {currentParam}
            <StyledTable>
                <thead>
                    <tr>
                        <StyledTh size={5}>번호</StyledTh>
                        <StyledTh size={50}>제목</StyledTh>
                        <StyledTh size={20}>등록일</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {noticeList?.length > 0 ? (
                        // {noticeList && noticeList?.length > 0 ? (
                        noticeList?.map((a) => {
                            // 3개 까지 들어감/ 첫번째 인자 (a): currentValue, 두번재 인자(i): index
                            return (
                                // key값은 중복되지 않는 값으로 넣는다
                                <tr key={a.noti_seq} onClick={() => handlerModal(a.noti_seq)}>
                                    <StyledTd>{a.noti_seq}</StyledTd>
                                    <StyledTd>{a.noti_title}</StyledTd>
                                    <StyledTd>{a.noti_date}</StyledTd>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <StyledTd colSpan={3}>데이터가 없습니다.</StyledTd>
                        </tr>
                    )}
                </tbody>
            </StyledTable>
            <PageNavigate
                onChange={searchNoticeList}
                totalItemsCount={listCount}
                itemsCountPerPage={5}
                activePage={currentParam as number} // as 타입: 강제적으로 특정타입으로 설정해줌 (타입단언)
            ></PageNavigate>
            {modal ? ( // props: 부모 컴포넌트에 있는 값을 자식 컴포넌트에 전달
                <Protal>
                    <NoticeModal
                        noticeSeq={notiSeq}
                        setNoticeSeq={setNotiSeq}
                        onSuccess={postSuccess}
                        handlerModal={handlerModal}
                    ></NoticeModal>
                </Protal>
            ) : null}
        </>
    );
};
