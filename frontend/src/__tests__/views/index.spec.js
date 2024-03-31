import { mount } from '@vue/test-utils'
import Index  from '@/views/Index.vue'
import {default as axios} from '@/tools/customizedAxios.js'
import MockAdapter from 'axios-mock-adapter'
import {router} from '@/router/index.js'
import { createRouter, createWebHistory } from 'vue-router'
import { useRoute, useRouter } from 'vue-router';

// const route = useRoute();
// const router = useRouter();

// const router = createRouter({
//     history: createWebHistory(),
//     routes: route
//   })


const baseURL = 'http://localhost:8000/api/task'


test("初期状態",async () => {
    // axiosを監視して、レスポンスのモックデータを設定
    const url = baseURL + "/"



    const mockedAxios = new MockAdapter(axios)
    mockedAxios.onGet(url).reply(200,
        [
            {
                id:1,
                task_name:'testTask',
                created_at:'2024-03-23T0000'
            }
        ]
    )


    // vi.mock("vue-router", () => ({
    //     useRoute() {
    //       return {
    //         route: "/",
    //         pathname: "",
    //         query: "",
    //         asPath: "",
    //       };
    //     },
    //   }));

    // const response = await axios.get(baseURL + "/")
    // console.log(response.data);
    // console.log("test");
    // await router.isReady()
    const wrapper = await mount(Index,
        {
            global: {
              plugins: [router]
            }
        }
    )
    console.log(wrapper.vi.tasks);


})