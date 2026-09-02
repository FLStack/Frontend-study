import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from './components/Header';
import MemberForm from './components/MemberForm';
import MemberList from './components/MemberList';
import type { Member } from './types/member';
import { ROLE_OPTIONS } from './types/member';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function App() {
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<string>('FE 개발자');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Member[]>(`${API_BASE_URL}/api/members`);
      setMembers(response.data);
    } catch (err) {
      console.error(err);
      setError('백엔드 서버 연결 실패 (서버 상태를 확인하세요)');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadMembers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<Member[]>(`${API_BASE_URL}/api/members`);

        if (isMounted) {
          setMembers(response.data);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          setError('백엔드 서버 연결 실패 (서버 상태를 확인하세요)');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadMembers();

    return () => {
      isMounted = false;
    };
  }, []);

  const addMember = async () => {
    if (!name.trim()) {
      alert('이름을 입력해주세요!');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/members`, {
        name: name.trim(),
        role,
      });
      setName('');
      await fetchMembers();
    } catch (err) {
      console.error(err);
      alert('DB 저장 실패!');
      setLoading(false);
    }
  };

  const deleteMember = async (id?: number) => {
    if (!id) return;
    if (!confirm('정말 삭제하시겠습니까?')) return;

    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/members/${id}`);
      await fetchMembers();
    } catch (err) {
      console.error(err);
      alert('삭제 실패!');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4 sm:p-6 font-sans antialiased relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-800/80 transition-all z-10">
        <Header />

        <MemberForm
          name={name}
          role={role}
          loading={loading}
          roleOptions={ROLE_OPTIONS}
          onNameChange={setName}
          onRoleChange={setRole}
          onSubmit={addMember}
        />

        <MemberList members={members} loading={loading} error={error} onDelete={deleteMember} />

        <button
          onClick={fetchMembers}
          disabled={loading}
          className="w-full py-3 px-4 bg-slate-800/80 hover:bg-slate-700/80 active:scale-[0.99] disabled:opacity-50 text-slate-300 font-medium rounded-xl border border-slate-700/60 transition-all cursor-pointer text-sm shadow-sm"
        >
          목록 새로고침
        </button>
      </div>
    </div>
  );
}