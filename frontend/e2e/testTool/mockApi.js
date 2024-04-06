const apiBaseURL = 'http://localhost:8000/api/task'
// なくても良いかもだけどあるとわかりやすいと思うので作る

export async function mockedResponse({page,url,status,body}) {
    await page.route(apiBaseURL + url, async route => {
        await route.fulfill({
            status:status,
            body: JSON.stringify(body),
        });
    });
}


export async function mockedNetworkErrorResponse({page,url}) {
    await page.route(apiBaseURL + url, async route => {
        await route.abort()
    });
}

