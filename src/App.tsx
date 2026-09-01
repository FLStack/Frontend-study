import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Member 데이터 타입
interface Member {
  id?: number;
  name: string;
}

// 환경 변수 불러오기
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function App() {
  const [name, setName] = useState<string>('');
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
    const timer = window.setTimeout(() => {
      void fetchMembers();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchMembers]);

  // 3. DB에 새 Member 추가하기
  const addMember = async () => {
    if (!name.trim()) {
      alert('이름을 입력해주세요!');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/members`, { name });
      setName('');
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert('DB 저장 실패!');
      setLoading(false);
    }
  };

  // 4. DB에서 Member 삭제하기
  const deleteMember = async (id?: number) => {
    if (!id) return;
    if (!confirm('정말 삭제하시겠습니까?')) return;

    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/members/${id}`);
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert('삭제 실패!');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4 sm:p-6 font-sans antialiased relative overflow-hidden">
      {/* 배경 장식용 무드 글로우 효과 */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 메인 카드 */}
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-800/80 transition-all z-10">
        
        {/* 헤더 영역 */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            React + Spring Boot + Supabase
          </span>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">멤버 메모장</h1>
          <p className="text-xs text-slate-400 mt-1">TypeScript & Tailwind CSS</p>
        </div>

        {/* 입력폼 영역 */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름 입력..."
            className="flex-1 px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
            onKeyDown={(e) => e.key === 'Enter' && addMember()}
          />
          <button
            onClick={addMember}
            disabled={loading}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold rounded-xl transition-all text-sm shadow-md shadow-indigo-600/20 cursor-pointer whitespace-nowrap"
          >
            저장
          </button>
        </div>

        {/* 데이터 목록 영역 */}
        <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/60 mb-6 min-h-[160px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-6 text-indigo-400 gap-2">
              <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium text-slate-400">서버와 통신 중...</span>
            </div>
          ) : error ? (
            <div className="text-center text-rose-400 p-4">
              <p className="text-sm font-semibold">⚠️ 연결 에러</p>
              <p className="text-xs mt-1 text-rose-400/80">{error}</p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-sm">
              <p>저장된 멤버가 없습니다.</p>
              <p className="text-xs text-slate-600 mt-1">이름을 입력하여 등록해 보세요!</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  등록된 멤버 목록
                </span>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                  {members.length}명
                </span>
              </div>
              
              <ul className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="flex justify-between items-center bg-slate-900/90 hover:bg-slate-800/60 px-3.5 py-2.5 rounded-xl border border-slate-800/80 text-sm transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900/40">
                        #{member.id}
                      </span>
                      <span className="font-semibold text-slate-200">{member.name}</span>
                    </div>

                    <button
                      onClick={() => deleteMember(member.id)}
                      className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg border border-transparent hover:border-rose-900/40 transition-all cursor-pointer"
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 새로고침 버튼 */}
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