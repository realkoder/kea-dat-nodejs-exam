<script lang="js">
  import HomeNavWthSidebar from '../../components/HomeNavWthSidebar/HomeNavWthSidebar.svelte';
  import Header from '../../components/Header/Header.svelte';
  import CreateChatroomDialog from '../../components/CreateChatroom/CreateChatroomDialog/CreateChatroomDialog.svelte';
  import ChatroomTable from '../../components/ChatroomTable/ChatroomTable.svelte';
</script>

<div class="grid h-screen w-full pl-[53px]">
  <HomeNavWthSidebar />

  <div class="flex flex-col">
    <Header />
    <main
      class="mx-auto grid w-full flex-1 gap-4 overflow-auto p-4 md:lg:col-span-full lg:lg:col-span-full lg:w-10/12"
    >
      <CreateChatroomDialog />
      <ChatroomTable />
    </main>
  </div>
</div>
