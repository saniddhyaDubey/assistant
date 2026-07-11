import { login } from "@/app/actions/login";
import { Button } from "@/components/ui/Button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="mx-auto mt-24 max-w-xs">
      <h1 className="mb-6 text-center text-lg">
        sd<span className="text-accent">.</span> log
      </h1>
      <form action={login} className="flex flex-col gap-3">
        <input type="hidden" name="next" value={next ?? "/"} />
        <input
          type="password"
          name="passcode"
          placeholder="passcode"
          autoFocus
          className="border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground"
        />
        {error && <p className="text-xs text-accent">wrong passcode</p>}
        <Button type="submit" variant="solid">
          enter
        </Button>
      </form>
    </div>
  );
}
