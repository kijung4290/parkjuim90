import { notFound } from 'next/navigation';
import DbStatus from './DbStatus';

// 연결 진단 화면은 개발 중에만 열립니다. (배포된 사이트에서는 404)
export default function TestDbPage() {
    if (process.env.NODE_ENV === 'production') notFound();
    return <DbStatus />;
}
