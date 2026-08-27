const Loading = () => {
    return (
        <div className="flex h-96 w-full items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-xs text-muted-foreground">Loading...</p>
            </div>
        </div>
    );

}
export default Loading