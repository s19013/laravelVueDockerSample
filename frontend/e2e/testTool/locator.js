// なくても良いかもだけどあるとわかりやすいと思うので作る

// optionは必須ではない
export async function fillTextarea({page,value,option={}}){
    const textarea = await page.getByRole('textbox',option)
    await textarea.fill(value)
}

// optionは必須ではない
export async function clickButton({page,option={}}) {
    const button = await page.getByRole('button',option)
    await button.click()
}