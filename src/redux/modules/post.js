import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { apis } from "../../shared/api";

// Action
const GET_POST_LIST = "GET_POST_LIST";
const GET_POST = "GET_POST";
const GET_RANKING = "GET_RANKING";

const DELETE_POST = "DELETE_POST";

const GET_USER_POST = "GET_USER_POST";
const GET_USER_INFO = "GET_USER_INFO";
const GET_USER_POSTS = "GET_USER_POSTS";

const LIKE_POST = "LIKE_POST";
const BOOKMARK = "BOOKMARK";

const CURRENT_PAGE = "CURRENT_PAGE";
const TOTAL_PAGE = "TOTAL_PAGE";

const RESET = "RESET";

// Action Creator
const getPostList = createAction(GET_POST_LIST, (postList) => ({ postList }));
const getPost = createAction(GET_POST, (post) => ({ post }));
const getRanking = createAction(GET_RANKING, (post) => ({ post }));

const deletePost = createAction(DELETE_POST, (id) => ({ id }));

const getUserPost = createAction(GET_USER_POST, (post) => ({
  post,
}));
const getUserInfo = createAction(GET_USER_INFO, (post) => ({
  post,
}));
const getUserPosts = createAction(GET_USER_POSTS, (post) => ({
  post,
}));

const likePost = createAction(LIKE_POST, (postId, data) => ({ postId, data }));
const bookmark = createAction(BOOKMARK, (postId, data) => ({ postId, data }));

export const currentPage = createAction(CURRENT_PAGE, (page) => ({ page }));
export const totalPage = createAction(TOTAL_PAGE, (page) => ({ page }));

const reset = createAction(RESET, () => ({}));

// InitialState
const initialState = {
  postOne: {},
  postList: [{}],
  ranking: [{}],

  userPost: [],
  userInfo: [],
  userPosts: [],

  currentPage: 0,
  totalPage: 0,
};

// Middleware
// 메인 페이지네이션
export const getPostPageDB = (page) => {
  return async function (dispatch) {
    try {
      const response = await apis.loadPage(page);
      dispatch(totalPage(response.data.totalPages));
      dispatch(getPostList(response.data));
    } catch (error) {
      alert("게시물을 불러오는 중에 오류가 발생했습니다.");
      console.log(error);
    }
  };
};

// 한 개 게시물 받아오기
export const getPostDB = (postId) => {
  return async function (dispatch) {
    apis
      .loadPost(postId)
      .then((response) => {
        dispatch(getPost(response.data));
      })
      .catch((error) => {
        window.alert("게시물을 불러오는 중에 오류가 발생했습니다.");
        console.log(error);
      });
  };
};

// 마이페이지 유저데이터 받아오기
export const getUserInfoDB = (postId) => {
  return async function (dispatch) {
    apis
      .loadUserInfoList(postId)
      .then((response) => {
        dispatch(getUserInfo(response.data));
      })
      .catch((error) => {
        window.alert("게시물을 불러오는 중에 오류가 발생했습니다.");
        console.log(error);
      });
  };
};

// 마이페이지 내 게시물 4개 받아오기
export const getUserPostDB = () => {
  return async function (dispatch) {
    apis
      .loadUserPost()
      .then((response) => {
        console.log(response);
        dispatch(getUserPost(response.data));
      })
      .catch((error) => {
        window.alert("게시물을 불러오는 중에 오류가 발생했습니다.");
        console.log(error);
      });
  };
};

// 마이페이지 내 게시물 전체 받아오기
export const getUserPostsDB = () => {
  return async function (dispatch) {
    apis
      .loadUserPostList()
      .then((response) => {
        console.log(response);
        dispatch(getUserPosts(response.data));
      })
      .catch((error) => {
        window.alert("게시물을 불러오는 중에 오류가 발생했습니다.");
        console.log(error);
      });
  };
};

// 게시물 랭킹 받아오기
export const getRankingDB = () => {
  return async function (dispatch) {
    try {
      const response = await apis.loadRanking();
      dispatch(getRanking(response.data));
    } catch (error) {
      alert("랭킹을 불러오는 중에 오류가 발생했습니다.");
      console.log(error);
    }
  };
};

// 게시물 작성, 수정
export const addPostDB = (id, formData) => {
  return async function (dispatch) {
    try {
      if (id) {
        await apis.editPost(id, formData);
      } else {
        await apis.addPost(formData);
      }
      dispatch(currentPage(1));
      dispatch(reset());
      dispatch(getPostPageDB(0));
    } catch (error) {
      window.alert("게시물 등록 중에 오류가 발생했습니다.");
      console.log(error);
    }
  };
};

// 좋아요
export const addHeartDB = (postId) => async (dispatch) => {
  try {
    if (!localStorage.getItem("jwtToken")) {
      window.alert("로그인한 사용자만 가능합니다.");
      return false;
    }
    // console.log("게시글에 하트 추가할 준비", postId);
    const { data } = await apis.addHeart(postId);
    console.log(data);
    dispatch(likePost(postId, data));
  } catch (error) {
    window.alert("하트 등록 중에 오류가 발생했습니다.");
    console.log(error);
  }
};

// 게시물 삭제
export const deletePostDB = (id) => {
  return async function (dispatch) {
    try {
      await apis.deletePost(id);
      dispatch(deletePost(id));

      dispatch(currentPage(1));
      dispatch(reset());
      dispatch(getPostPageDB(0));
    } catch (error) {
      alert("게시물 삭제 중에 오류가 발생했습니다.");
      console.log(error);
    }
  };
};

// 북마크
export const bookmarkDB = (postId) => {
  return async function (dispatch) {
    try {
      if (!localStorage.getItem("jwtToken")) {
        window.alert("로그인한 사용자만 가능합니다.");
        return false;
      }

      const { data } = await apis.bookmark(postId);
      dispatch(bookmark(postId, data));
    } catch (error) {
      alert("북마크 시도 중에 오류가 발생했습니다.");
      console.log(error);
    }
  };
};

// Reducer
export default handleActions(
  {
    [GET_POST_LIST]: (state, { payload }) =>
      produce(state, (draft) => {
        if (state.postList.length === 1) draft.postList = payload.postList;
        else draft.postList = [...draft.postList, ...payload.postList];
      }),
    [GET_POST]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.postOne = payload.post;
      }),
    [GET_USER_POST]: (state, { payload }) =>
      produce(state, (draft) => {
        console.log(payload);
        draft.userPost = payload.post;
      }),
    [GET_USER_INFO]: (state, { payload }) =>
      produce(state, (draft) => {
        console.log(payload);
        draft.userInfo = payload.post;
      }),
    [GET_USER_POSTS]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.userPosts = payload.post;
      }),
    [GET_RANKING]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.ranking = payload.post;
      }),
    [LIKE_POST]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.postList = draft.postList.map((post) => {
          if (Number(post.id) === Number(payload.postId)) {
            if (payload.data) return { ...post, heartCnt: post.heartCnt + 1 };
            else return { ...post, heartCnt: post.heartCnt - 1 };
          } else {
            return post;
          }
        });
      }),
    [DELETE_POST]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.postList = draft.postList.filter(
          (post) => Number(post.id) !== Number(payload.id)
        );
      }),
    [BOOKMARK]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.postList = draft.postList.map((post) => {
          if (Number(post.id) === Number(payload.postId)) {
            if (payload.data)
              return { ...post, bookmarkCnt: post.bookmarkCnt + 1 };
            else return { ...post, bookmarkCnt: post.bookmarkCnt - 1 };
          } else {
            return post;
          }
        });
      }),
    [CURRENT_PAGE]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.currentPage = payload.page;
      }),
    [TOTAL_PAGE]: (state, { payload }) =>
      produce(state, (draft) => {
        draft.totalPage = payload.page - 1;
      }),
    [RESET]: (state) =>
      produce(state, (draft) => {
        draft.postList = initialState.postList;
      }),
  },
  initialState
);
