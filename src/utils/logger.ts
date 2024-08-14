export const logger = (event: string, user: string, msg: string, stack: string) => {
  console.error(`{"datetime": "${new Date().toLocaleString()}", "event": "${event}", "user": "${user}", "message": "${msg}", "stack": "${stack}"}`);
}