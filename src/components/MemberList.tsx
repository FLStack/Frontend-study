import type { Member } from '../types/member';

interface MemberListProps {
  members: Member[];
  loading: boolean;
  error: string | null;
  onDelete: (id?: number) => void;
}

export default function MemberList({ members, loading, error, onDelete }: MemberListProps) {
  if (loading) {
    return (
      <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/60 mb-6 min-h-[160px] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center py-6 text-indigo-400 gap-2">
          <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium text-slate-400">서버와 통신 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/60 mb-6 min-h-[160px] flex items-center justify-center">
        <div className="text-center text-rose-400 p-4">
          <p className="text-sm font-semibold">연결 에러</p>
          <p className="text-xs mt-1 text-rose-400/80">{error}</p>
        </div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/60 mb-6 min-h-[160px] flex items-center justify-center">
        <div className="text-center py-6 text-slate-500 text-sm">
          <p>저장된 정보 없음</p>
          <p className="text-xs text-slate-600 mt-1">이름과 역할을 선택하여 등록</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/60 mb-6 min-h-[160px]">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          등록된 정보 목록
        </span>
        <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
          {members.length}
        </span>
      </div>

      <ul className="space-y-2 max-h-52 overflow-y-auto pr-1">
        {members.map((member) => (
          <li
            key={member.id}
            className="flex justify-between items-center bg-slate-900/90 hover:bg-slate-800/60 px-3.5 py-2.5 rounded-xl border border-slate-800/80 text-sm transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-900/40">
                #{member.id}
              </span>
              <span className="font-semibold text-slate-200">{member.name}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/60 font-medium">
                {member.role || '미지정'}
              </span>
            </div>

            <button
              onClick={() => onDelete(member.id)}
              className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg border border-transparent hover:border-rose-900/40 transition-all cursor-pointer"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
