<script lang="ts">
  import dayjs from 'dayjs'
  import { onMount } from 'svelte'
  import { runQuery, user } from '$lib/store'
  import UserMenu from '$lib/UserMenu.svelte'

  interface Message {
    contactEmail: string
    contactName: string
    created: string
    message: string
    title: string
  }

  let messages: Message[] = []

  const fetchMessages = async () => {
    await runQuery('messages', 'GET', null, $user.token).then((results: Message[] | []) => {
      messages = results
    })
  }

  onMount(() => {
    fetchMessages()
  })
</script>

<UserMenu state="messages" title="Yhteydenotot" />

<div class="font-content gap-4 grid max-w-screen-lg mb-10 mx-auto px-4">
  {#if Array.isArray(messages) && messages.length}
    {#each messages as message}
      <div class="bg-white border border-gray-600 border-solid rounded-lg">
        <div class="px-4 py-2">{dayjs(message.created).format('DD.MM.YY HH:mm')} | {message.title}</div>
        <div class="border border-gray-600 border-l-0 border-r-0 border-solid p-4">{message.message}</div>
        <div class="px-4 py-2">{message.contactName} | {message.contactEmail}</div>
      </div>
    {/each}
  {/if}
</div>
