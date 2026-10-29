export function StatCard({label, value}: {label: string; value: number}){
    return (
      <div className="bg-chart-1 p-3 max-w-xl h-full w-full">
        <p className="text-2xl">{value}</p>
        <p>{label}</p>
      </div>
    );
}