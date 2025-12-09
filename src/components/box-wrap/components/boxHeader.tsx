interface BoxHeaderProps {
  title?: string;
}

// ml-7.5 mt-2.5
export default function BoxHeader({ title }: BoxHeaderProps) {
  return (
    <div className="box-header p-4 pt-1.5 bg-no-repeat bg-cover bg-center bg-[url('@/assets/icons/cyber/box-header2.svg')] flex items-center pl-21">
      {title && (
        <span className="text-[28px] text-white font-[YouSheTitleHei]">
          {title}
        </span>
      )}
    </div>
  );
}
