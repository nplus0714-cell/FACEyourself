-- The FACE assessment obtains an authenticated anonymous session before it
-- calls this function. The raw anon PostgREST role does not need RPC access.
revoke execute on function public.complete_assessment(uuid, text, jsonb, jsonb) from anon;
