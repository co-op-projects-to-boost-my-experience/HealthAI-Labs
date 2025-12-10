import Layout from "../../components/Layout";
import { fetchContact } from "../../api";
import { useQuery } from '@tanstack/react-query';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['contact'],
    queryFn: fetchContact,
    retry: 1
  });

  return (
    <Layout>
    </Layout>
  );
}