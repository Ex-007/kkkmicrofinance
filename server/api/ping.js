// /server/api/ping.ts
export default defineEventHandler(() => {
    console.log("API was pinged")
    return { status: "online" }
  })
  