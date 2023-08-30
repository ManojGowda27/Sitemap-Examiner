document.getElementById('code_form').addEventListener('submit', function(event)  {
    event.preventDefault()

    const sku_value = document.getElementById('codeInput').value

    const redirectUrl = `/redirect/${(sku_value)}`
    window.location.href = redirectUrl
    
})
