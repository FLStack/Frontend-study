interface MemberFormProps {
  name: string;
  role: string;
  loading: boolean;
  roleOptions: string[];
  onNameChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onSubmit: () => void;
}

export default function MemberForm({
  name,
  role,
  loading,
  roleOptions,
  onNameChange,
  onRoleChange,
  onSubmit,
}: MemberFormProps) {
  return (
    <div className="space-y-2 mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="이름 입력..."
          className="flex-1 px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        />
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="px-3 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          {roleOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-slate-900 text-slate-200">
              {opt}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] disabled:opacity-50 text-white font-semibold rounded-xl transition-all text-sm shadow-md shadow-indigo-600/20 cursor-pointer"
      >
        등록하기
      </button>
    </div>
  );
}
