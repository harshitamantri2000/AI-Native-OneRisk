import React from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { DashboardLayout } from "./components/DashboardLayout";
import { EDDCaseManagement } from "./components/EDDCaseManagement";
import { BulkUploadPage } from "./components/BulkUploadPage";
import { AlertsPage } from "./components/AlertsPage";
import { CreateNewCasePage } from "./components/CreateNewCasePage";
import { NewHomePage } from "./components/NewHomePage";
import { WorkspaceCaseDetailPage } from "./components/WorkspaceCaseDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, element: <Navigate to="/workspace" replace /> },
      { path: "home", Component: NewHomePage },
      { path: "workspace", Component: EDDCaseManagement },
      { path: "workspace/case/:caseId", Component: WorkspaceCaseDetailPage },
      { path: "alerts", Component: AlertsPage },
      { path: "bulk-upload", Component: BulkUploadPage },
      { path: "new-case", Component: CreateNewCasePage },
      { path: "*", element: <Navigate to="/workspace" replace /> },
    ],
  },
]);
