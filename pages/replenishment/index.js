import { getData, patchData } from '../../modules/http';

const form = document.forms.replenishment
const select = document.querySelector('select')
const userData = JSON.parse(localStorage.getItem("user"))
let balanceCard = document.querySelector(".balance-card")
let cards = []

getData("/cards?user_id=" + userData.id)
    .then(res => {
        cards = res.data
        for (let card of cards) {
            let opt = new Option(card.name, JSON.stringify(card))
            select.append(opt)
        }
    })

    select.oninput = () => {
        let selectedCard = JSON.parse(select.value)
        if (selectedCard) {
            balanceCard.innerHTML = `Balance card: ${selectedCard.balance}`
        } else {
            balanceCard.innerHTML = `Balance card:`
        }
    }


form.onsubmit = (e) => {
    e.preventDefault()

    const selectedCard = JSON.parse(select.value)
    const amountToAdd = +form.elements.total.value

    const newBalance = selectedCard.balance + amountToAdd

    const updatedCardData = { ...selectedCard, balance: newBalance }
    patchData(`/cards/${selectedCard.id}`, updatedCardData)
        .then(patchRes => {
            if (patchRes.status === 200) {
                alert('Баланс успешно пополнен!')
                location.assign('/')
            } else {
                alert('Произошла ошибка при пополнении баланса.')
            }
        })
        form.reset()
     
}
