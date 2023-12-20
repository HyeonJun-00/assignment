class Event{
    static setLoginPageEvent() {

    }
    static setSignupPageEvent() {

    }
    static setContentsPageEvent() {

    }
}


class Page {
    constructor() {

    }
    getLoginPage() {
        $("#mainPage").html(`
            <section id="loginPage">
                <div id="idBox">
                  <input type="text" placeholder="ID">
                  <input type="password" placeholder="Password">
                </div>
                <div id="buttonBox">
                  <button>Sign in</button>
                  <button>Sign up</button>
                </div>
            </section>
        `);
    }
    getSignupPage() {
        $("#mainPage").html(`
              <section id="signupPage">
                <div id="idBox">
                  <div>
                    <input type="text" placeholder="ID">
                    <button>중복 확인</button>
                  </div>
                  <input type="password" placeholder="Password">
                </div>
                <div id="buttonBox">
                  <button>Sign up</button>
                </div>
              </section>
        `);
    }
    getContentsPage() {
        $("#mainPage").html(`
            <section id="contentsPage">
                <article id="classificationArticle">
                    <div>
                        <button>Rooms</button>
                        <button>users</button>
                        <button>Friends</button>
                        <button>Logout</button>
                    </div>
                </article>
                <article id="contentsArticle"></article>
            </section>
        `);
        Event.setContentsPageEvent();
    }
}
$("#classificationArticle button").on("click", function () {
    $("#classificationArticle button").removeClass("selectFlag");
    $(this).addClass("selectFlag");
});
const test = new Page();

// $.ajax({
//     url: "http://kkms4001.iptime.org:10098/",
//     type: "get",
//     success: (data) => {
//         console.log(data);
//     }
// });
