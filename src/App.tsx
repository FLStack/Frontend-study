import { useState, useEffect } from 'react';
import axios from 'axios';

// Member 데이터 타입
interface Member {
  id?: number;
  name: string;
}

// 환경 변수 불러오기 (Vercel 환경 변수가 없으면 로컬 localhost:8080을 기본값으로 사용)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function App() {
  const [name, setName] = useState<string>('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. DB 전체 목록 불러오기
  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      // API_BASE_URL 변수 적용
      const response = await axios.get<Member[]>(`${API_BASE_URL}/api/members`);
      setMembers(response.data);
    } catch (err) {
      console.error(err);
      setError('백엔드 서버 연결 실패 (서버가 켜져 있는지 확인하세요)');
    } finally {
      setLoading(false);
    }
  };

  // 2. DB에 새 Member 추가하기
  const addMember = async () => {
    if (!name.trim()) {
      alert('이름을 입력해주세요!');
      return;
    }

    setLoading(true);
    try {
      // API_BASE_URL 변수 적용
      await axios.post(`${API_BASE_URL}/api/members`, { name });
      setName(''); // 입력창 초기화
      fetchMembers(); // 추가 후 목록 갱신
    } catch (err) {
      console.error(err);
      alert('DB 저장 실패!');
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 초기 목록 불러오기
  useEffect(() => {
    const init = async () => {
      await fetchMembers();
    };
    init();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100">
      <div className="max-w-md w-full bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-800 transition-all">
        {/* 헤더 영역 */}
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/50 rounded-full mb-2">
            React + Spring Boot + Supabase
          </span>
          <h1 className="text-2xl font-bold text-slate-100">DB 연동 테스트</h1>
          <p className="text-sm text-slate-400 mt-1">TypeScript & Tailwind CSS</p>
        </div>

        {/* 입력폼 영역 */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름 입력"
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && addMember()}
          />
          <button
            onClick={addMember}
            disabled={loading}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white font-medium rounded-xl transition-colors text-sm cursor-pointer whitespace-nowrap"
          >
            DB 저장
          </button>
        </div>

        {/* 데이터 카드 영역 */}
        <div className="bg-slate-950/70 rounded-xl p-6 border border-slate-800 mb-6 min-h-[140px] flex items-center justify-center">
          {loading ? (
            <div className="flex items-center space-x-2 text-indigo-400">
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">서버와 통신 중...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 text-sm">
              <p className="font-semibold">⚠️ 연결 에러</p>
              <p className="text-xs mt-1 text-red-400/80">{error}</p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center text-slate-500 text-sm">
              저장된 데이터가 없습니다. 이름을 입력하고 저장해보세요!
            </div>
          ) : (
            <div className="w-full">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                DB 데이터 목록 ({members.length}건)
              </p>
              <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="flex justify-between items-center bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 text-sm"
                  >
                    <span className="text-indigo-400 font-mono text-xs">ID: {member.id}</span>
                    <span className="font-medium text-slate-200">{member.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 다시 불러오기 버튼 */}
        <button
          onClick={fetchMembers}
          disabled={loading}
          className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 text-slate-300 font-medium rounded-xl border border-slate-700 transition-colors duration-200 cursor-pointer text-sm"
        >
          목록 새로고침
        </button>
      </div>
    </div>
  );
}