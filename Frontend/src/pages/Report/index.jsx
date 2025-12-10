import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { fetchReport } from "../../api";
import { useQuery } from '@tanstack/react-query';
import { FileText, Calendar, Download } from 'lucide-react';

export default function ReportPage() {
  return (
    <ProtectedRoute>
      <Layout>
      </Layout>
    </ProtectedRoute>
  );
}