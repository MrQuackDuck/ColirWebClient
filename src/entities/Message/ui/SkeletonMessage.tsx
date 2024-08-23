import { Skeleton } from "@/shared/ui/skeleton";

function SkeletonMessage() {
	return (
		<div className="pl-2 py-0.5 my-1 flex flex-col gap-0.5">
			<div className="flex h-5 items-center max-w-24 flex-row gap-1">
				<Skeleton className="w-[60%] h-3" />
				<Skeleton className="w-[40%] h-3" />
			</div>
			<Skeleton className="max-w-56 h-3" />
		</div>
	);
}

export default SkeletonMessage;
