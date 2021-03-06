import React, { useEffect } from "react";
import styled from "styled-components";
import Header from "../components/Header";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserPostDB, getUserInfoDB } from "../redux/modules/post";
// 이미지
import Profile from "../image/Profile.png";
import BookMark from "../image/Bookmark.png";
import Heart from "../image/HeartB.png";
import coupon from "../image/coupon.png";

const Mypage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = localStorage.getItem("jwtToken");

  const loginCheck = () => {
    if (!isLogin) {
      return navigate("/login");
    }
  };

  const post = useSelector((state) => state.post.userPost);
  const userInfo = useSelector((state) => state.post.userInfo);
  console.log(post);
  console.log(userInfo);

  //   const Email = localStorage.getItem("nickname");
  //   console.log(Email);

  React.useEffect(() => {
    dispatch(getUserPostDB());
    dispatch(getUserInfoDB());
    loginCheck();
  }, [dispatch]);

  return (
    <React.Fragment key={post.imageUrl}>
      <Header />
      <Wrap>
        <ProfileWrap>
          <ProfileImage src={Profile} alt="프로필 이미지" />
          <Nickname>{userInfo.userNickname}</Nickname>
          <ProfileBtn
            onClick={() => {
              navigate("/users/edit");
            }}
          >
            설정
          </ProfileBtn>
          <BottomWrap>
            <MiniDiv>
              <Book src={BookMark} alt="스크랩북" />
              <Span>스크랩북</Span>
              <Num>{userInfo.bookmarkCnt}</Num>
            </MiniDiv>
            <MiniDiv>
              <HeartIcon src={Heart} alt="좋아요" />
              <Span>좋아요</Span>
              <Num>{userInfo.heartCnt}</Num>
            </MiniDiv>
            <MiniDiv>
              <CouponIcon src={coupon} alt="쿠폰" />
              <Span>내 쿠폰</Span>
              <Num>0</Num>
            </MiniDiv>
          </BottomWrap>
        </ProfileWrap>
        <Div />
        <PhotoWrap>
          <PhotoTitle>
            <div>
              <Title>사진</Title>
              <PNum>{post?.length}</PNum>
            </div>
            <ViewBtn
              onClick={() => {
                navigate("/users/collections");
              }}
            >
              전체보기
            </ViewBtn>
          </PhotoTitle>
          <PhotoBoxs>
            {post.map((list, index) => {
              return (
                <>
                  <Photo
                    onClick={() => {
                      navigate("/users/collections");
                    }}
                    key={index}
                    imageUrl={list.imageUrl}
                  />
                </>
              );
            })}
          </PhotoBoxs>
          <TextBoxs>
            <Plus>+</Plus>
            <PlusText
              onClick={() => {
                navigate("/contents/new");
              }}
            >
              사진 올리기
            </PlusText>
          </TextBoxs>
        </PhotoWrap>
      </Wrap>
    </React.Fragment>
  );
};

const Wrap = styled.div`
  max-width: 1256px;
  width: 90%;
  height: 600px;
  /* margin-left: 6px;
  margin-left: 8px; */
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  margin: auto;
  padding-top: 150px;
  @media only screen and (max-width: 1024px) {
    display: flex;
    flex-direction: column;
  }
`;

const ProfileWrap = styled.div`
  width: 195px;
  height: 376px;
  padding: 30px 25px 18px 25px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgb(218, 220, 224);
  box-shadow: rgb(63 71 77 / 6%) 0px 2px 4px 0px;
  @media only screen and (max-width: 1024px) {
    width: 95%;
    margin: 40px 0px;
  }
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
`;

const Nickname = styled.span`
  margin-top: 10px;
  font-size: 26px;
  color: rgb(41, 41, 41);
  font-weight: bold;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Div = styled.div`
  width: 8.33333%;
  padding-left: 10px;
  padding-right: 10px;
  @media only screen and (max-width: 1024px) {
    display: none;
  }
`;

const PhotoWrap = styled.div`
  width: 66.6667%;
  height: 673px;
  display: flex;
  flex-direction: column;
  margin: auto;
  /* margin-bottom: 1000px; */
  @media only screen and (max-width: 1024px) {
    width: 90%;
  }
  @media only screen and (max-width: 770px) {
    width: 95%;
  }
`;

const ProfileBtn = styled.button`
  margin-right: 6px;
  font-weight: normal;
  font-size: 12px;
  color: rgb(41, 41, 41);
  background-color: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  box-sizing: border-box;
  padding: 7px 16px 7px 16px;
  margin-top: 12px;
  font-size: 14px;
  line-height: 19px;
  &:hover {
    background-color: #f2f2f2;
  }
`;

const BottomWrap = styled.div`
  border-top: 1px solid rgb(234, 235, 239);
  padding: 24px 0px 6px;
  font-size: 15px;
  color: #424242;
  width: 100%;
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const MiniDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Book = styled.img`
  width: 26px;
  height: auto;
  opacity: 0.8;
`;

const HeartIcon = styled.img`
  width: 30px;
  height: auto;
  opacity: 0.8;
`;

const CouponIcon = styled.img`
  width: 32px;
  height: auto;
  margin: 2px 0px;
  opacity: 0.8;
`;

const Span = styled.span`
  font-size: 14px;
  margin: 8px 0px 4px 0px;
`;

const Num = styled.span`
  font-weight: bold;
  font-size: 18px;
`;

const PhotoTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.span`
  font-weight: bold;
  font-size: 20px;
`;

const PNum = styled.span`
  font-weight: bold;
  font-size: 20px;
  color: #35c5f0;
  margin-left: 6px;
`;

const ViewBtn = styled.span`
  font-weight: 500;
  font-size: 14px;
  color: #35c5f0;
  margin-left: 6px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const PhotoBoxs = styled.div`
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
  align-items: center;
  flex-wrap: wrap;
  @media only screen and (max-width: 770px) {
    width: 100%;
  }
`;

const Photo = styled.div`
  /* max-width: 200px; */
  width: 23%;
  min-width: 190px;
  height: 190px;
  margin: 10px 10px 0px 0px;
  box-sizing: border-box;
  border-radius: 6px;
  background-color: #aaa;
  background-image: url(${(props) => props.imageUrl});
  background-position: center 30%;
  background-size: cover;
  cursor: pointer;
  @media only screen and (max-width: 770px) {
    min-width: 204px;
    height: 204px;

    display: flex;
    flex-wrap: wrap;
  }
`;

const TextBoxs = styled.button`
  width: 100%;
  border-radius: 4px;
  height: 50px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  border: 1px solid #dbdbdb;
  background-color: white;

  &:hover {
    background-color: #f2f2f2;
  }
`;

const Plus = styled.span`
  font-weight: 500;
  font-size: 26px;
  color: #757575;
`;

const PlusText = styled.span`
  font-weight: 500;
  font-size: 14px;
  color: #757575;
  margin-left: 4px;
`;

export default Mypage;
