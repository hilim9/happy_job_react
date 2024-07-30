import { useRef, useState } from "react";
import { Button } from "../../../common/Button/Button";
import { NoticeSearchStyled } from "./styled";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";

export const NoticeSearch = () => {
    const [startDate, setStartDate] = useState<String>(); // string으로 타입 지정
    const [endDate, setEndDate] = useState<String>(); // string으로 타입 지정
    const title = useRef<HTMLInputElement>(null);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const navigate = useNavigate(); // useNavigate: 원하는 url로 이동 가능

    const handlerSearch = () => {
        // 검색 버튼을 누르면, 조회가 된다.

        // string만 담길 수 있는 query배열 생성
        // string 타입이 아닌 다른 타입이 담길 시 에러 발생
        const query: string[] = [];

        !title.current?.value || query.push(`searchTitle=${title.current?.value}`);
        !startDate || query.push(`startDate=${startDate}`);
        !endDate || query.push(`endDate=${endDate}`);

        // 쿼리스트링
        const queryString = query.length > 0 ? `?${query.join("&")}` : "";
        navigate(`/react/board/notice.do${queryString}`); // 쿼리스트링을 포함하게 하는 url 생성

        // console.log(startDate, endDate);
        // console.log(title.current?.value);

        // title.current?.value의 의미
        // if (title) {
        //   console.log(title.current.value);
        // }
    };

    const handlerModal = () => {
        setModal(!modal);
    };

    return (
        <NoticeSearchStyled>
            <input ref={title}></input>
            <input type="date" onChange={(e) => setStartDate(e.target.value)}></input>
            <input type="date" onChange={(e) => setEndDate(e.target.value)}></input>
            <Button onClick={handlerSearch}>검색</Button>
            <Button onClick={handlerModal}>등록</Button>
        </NoticeSearchStyled>
    );
};
