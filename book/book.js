function Component() {

}

Component.init = function init() {
    function construct(constructor, args) {
        function ini() {
            return constructor.apply(this, args)
        }
        ini.prototype = constructor.prototype
        return new F()
    }

    return construct(this.prototype.constructor, arguments)
}

function Book($frame, store) {
    this.$charactersList = $('<div id="CharactersList" />').appendTo($frame)
    this.$singleCharacter = $('<div id="SingleCharacter" />').appendTo($frame)

    this.store = store
    var _this = this


    /* [get all books and show them in ui] 
    --------------------------------------------------------------------*/
    function display_books_in_ui(characters) {
        let content = '<div class="items_box">'
        for (i = 0; i < characters.length; i++) {
            content += '<a class="item" id="' + characters[i].id + '">';
            content += '<div class="image">';
            content += '<img src="' + characters[i].picture + '" alt="' + characters[i].name + '" width="100" height="100">';
            content += '</div>';
            content += '<div class="text">';
            content += '<h2>' + characters[i].name + '</h2><p>' + characters[i].species + '</p>';
            content += '</div>';
            content += '</a>';
        }
        content += '</div>';
        $("#CharactersList").append(content);
    }

    let content_main = '';
    
    var global_id;

    /* [get book id when click on item] 
    -------------------------------------------------------------*/
    function get_book_details() {

        $(".item").click(function () {

            content_main = '';
            // clean the box
            var chil = document.getElementById("SingleCharacter");
            while (chil.hasChildNodes()) {
                chil.removeChild(chil.lastChild);
                console.log("clean");
            }

            var res = $(this).prop("id");

            // invoke 'getCharacterDetails' from store.js
            
            store.getCharacterDetails(Number(res))
                .then(function (character) {
                    global_id = character.id;
                    // add data to ui
                    console.log(character);
                    content_main += '<div class="details_box id="' + character.id + '">'
                    content_main += '<div class="image">';
                    content_main += '<img src="' + character.picture + '" alt="' + character.name + '" width="100" height="100">';
                    content_main += '</div>';
                    content_main += '<div class="text">';
                    content_main += '<h2 data-editable>' + character.name + '</h2><p data-editable>' + character.species + '</p>';
                    content_main += '</div>';
                    content_main += '<p data-editable>' + character.description + '</p>';
                    content_main += '<button id="btn_edit">Edit</button>';
                    content_main += '</div>'

                    $("#SingleCharacter").append(content_main);

                    update_book(character);

                })
                .catch(function (error) {
                    // Some some popup with error
                    console.error(error)
                })
        })
    }


    /* [ show ui of update (with iputs)] 
    -------------------------------------------------------------*/
    function update_book(character) {
        $('#btn_edit').click(function () {
            
            // clean the box
            var chil = document.getElementById("SingleCharacter");
            while (chil.hasChildNodes()) {
                chil.removeChild(chil.lastChild);
                console.log("clean");
            }

            // show iputs to edit
            let content =
                '<section class="editor" >' +
                '<img src="' + character.picture + '" alt="' + character.name + '" width="100" height="100">' +
                '<input type="text" name="name" id="name_input" value="' + character.name + '"/>' +
                '<input type="text" name="species" id="species_input" value="' + character.species + '"/>' +
                '<textarea name="description" id="description_input">' + character.description + '</textarea>' +
                '<button type="button" id="saveCharacter" class="save">Save</button>' +
                '<button type="button" id="cancelCharacter" class="cancel">Cancel</button>' +
                '</section>'

            $("#SingleCharacter").append(content);

            content = '';

            cancel();

            save(character);


        })
    }

    /* [ cancel the update ] 
    -------------------------------------------------------------*/
    function cancel() {
        $("#cancelCharacter").click(function () {
            
            // clean the box
            var chil = document.getElementById("SingleCharacter");
            while (chil.hasChildNodes()) {
                chil.removeChild(chil.lastChild);
                console.log("clean");
            }

            $("#SingleCharacter").append(content_main);

        })
    }

    /* [ save the update ] 
    -------------------------------------------------------------*/
    function save(character) {
        $('#saveCharacter').click(function () {
            
            // get values from inputs
            let name = $('#name_input').val();
            let species = $('#species_input').val();
            let description = $('#description_input').val();

            var char = {
                id: character.id,
                name: name,
                species: species,
                picture: character.picture,
                description: description,
                _delay: 500
            }

            // pass new char to json-db
            store.updateCharacter(char)
                .then(function () {
                
                    // clean the box
                    var chil = document.getElementById("SingleCharacter");
                    while (chil.hasChildNodes()) {
                        chil.removeChild(chil.lastChild);
                        console.log("clean");
                    }

                    let new_content = '';
                
                    // add data to ui
                    new_content += '<div class="details_box id="' + character.id + '">'
                    new_content += '<div class="image">';
                    new_content += '<img src="' + character.picture + '" alt="' + name + '" width="100" height="100">';
                    new_content += '</div>';
                    new_content += '<div class="text">';
                    new_content += '<h2 data-editable>' + name + '</h2><p data-editable>' + species + '</p>';
                    new_content += '</div>';
                    new_content += '<p data-editable>' + description + '</p>';
                    new_content += '<button id="btn_edit">Edit</button>';
                    new_content += '</div>'

                    $("#SingleCharacter").append(new_content);

                    new_content = '';

                    $('#CharactersList .items_box').find('#' + character.id).find('.text').find('h2').html(name);

                    $('#CharactersList .items_box').find('#' + character.id).find('.text').find('p').html(species);


                })
                .catch(function (error) {
                    // Some some popup with error
                    console.error(error)
                })
        })
    }

    /* [ display all books in ui] 
    -------------------------------------------------------------*/
    this.store.getCharacters()
        .then(function (characters) {
            display_books_in_ui(characters);
            get_book_details();

        })
        .catch(function (error) {
            // Some some popup with error
            console.error(error)
        })
}
Book.init = Component.init
Book.prototype = Object.create(Component.prototype)
Book.prototype.constructor = Book
