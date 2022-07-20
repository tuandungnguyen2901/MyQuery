import { routePaths } from "@/const/routePaths";
import CompleteProfilePage from "@/pages/CompleteProfilePage/CompleteProfilePage";
import HomePage from "@/pages/HomePage/HomePage";
import MessengerPage from "@/pages/MessengerPage/MessengerPage";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import QueriesPage from "@/pages/QueriesPage/QueriesPage";
import QueryDetailPage from "@/pages/QueryDetailPage/QueryDetailPage";
import SignInPage from "@/pages/SignInPage/SignInPage";
import SignUpPage from "@/pages/SignUpPage/SignUpPage";
import TutorDetailPage from "@/pages/TutorDetailPage/UserDetailPage";
import TutorListPage from "@/pages/TutorListPage/TutorListPage";
import CallPage from "@/pages/CallPage/CallPage";

export interface RouterInterface {
  path?: string;
  needAuthor?: boolean;
  grantPermission?: Array<any>;
  component?: any;
}

export const routerConfig: Array<RouterInterface> = [
  {
    path: routePaths.HOME,
    component: HomePage,
    needAuthor: true,
    grantPermission: [],
  },
  {
    path: routePaths.SIGN_IN_PAGE,
    component: SignInPage,
    needAuthor: true,
    grantPermission: [],
  },
  {
    path: routePaths.SIGN_UP_PAGE,
    component: SignUpPage,
    needAuthor: true,
    grantPermission: [],
  },
  {
    path: routePaths.HOME,
    component: SignUpPage,
    needAuthor: true,
    grantPermission: [],
  },
  {
    path: routePaths.MESSENGER,
    component: MessengerPage,
    needAuthor: true,
    grantPermission: [],
  },
  {
    path: routePaths.CALL,
    component: CallPage,
    needAuthor: true,
    grantPermission: [],
  },
  {
    path: routePaths.QUERIES_PAGE,
    component: QueriesPage,
    needAuthor: true,
    grantPermission: [],
  },
  {
    path: routePaths.QUERY_DETAIL,
    component: QueryDetailPage,
    needAuthor: true,
    grantPermission: [],
  },
  {
    path: routePaths.TUTOR_DETAIL_PAGE,
    component: TutorDetailPage,
    needAuthor: true,
    grantPermission: [],
  },
  {
    path: routePaths.TUTOR_LIST_PAGE,
    component: TutorListPage,
    needAuthor: true,
    grantPermission: [],
  },
  {
    path: routePaths.ABOUT_US,
    component: NotFoundPage,
    needAuthor: true,
    grantPermission: [],
  },
  {
    path: routePaths.COMPLETE_PROFILE,
    component: CompleteProfilePage,
    needAuthor: true,
    grantPermission: [],
  },
];
