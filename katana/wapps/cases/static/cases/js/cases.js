var cases = {

    mappings: {
        newStep: {
            title:  "New Step"
        },
        newReq: {
            title: "New Requirement"
        },
        editDetails: {
            title: "Edit Details"
        }
    },

    header: {
        toggleContents: function() {
            var $elem = $(this);
            if ($elem.attr('collapsed') === 'false') {
                $elem.attr('collapsed', 'true');
                $elem.removeClass('fa-chevron-circle-up');
                $elem.addClass('fa-chevron-circle-down');
                $elem.closest('.cases-header').next().hide()
            } else {
                $elem.attr('collapsed', 'false');
                $elem.removeClass('fa-chevron-circle-down');
                $elem.addClass('fa-chevron-circle-up');
                $elem.closest('.cases-header').next().show()
            }
        },
    },

    drawer: {

        toggleDrawer: function(){
            var $elem = $(this);
            console.log($elem.attr('collapsed'));
            if ($elem.attr('collapsed') === 'true') {
                console.log($elem.closest('.cases-side-drawer-closed'));
                $elem.closest('.cases-side-drawer-closed').hide();
                $elem.closest('.cases-side-drawer-closed').siblings('.cases-side-drawer-open').show();
            } else {
                $elem.closest('.cases-side-drawer-open').hide();
                $elem.closest('.cases-side-drawer-open').siblings('.cases-side-drawer-closed').show();
            }
        },

        open: {

            switchView: function(){
                var $elem = $(this);
                var $sidebar = $elem.closest('.sidebar');
                var $highlighted = $sidebar.find('.cases-icon-bg-color');
                $highlighted.removeClass('cases-icon-bg-color');
                $elem.parent().addClass('cases-icon-bg-color');
                var marker = $elem.attr('ref');
                $elem.closest('.cases-side-drawer-open').find('.cases-header-title').html(cases.mappings[marker].title);
            }
        },
    },

    tvArgs: {
        "collapseIcon": "fa fa-minus-circle",
        "expandIcon": "fa fa-plus-circle",
        "levels": 0,
        "onhoverColor": "#b1dfbb",
        "expandOnHover": true
    },

    invert: function(){
        var toolbarButtons = katana.$activeTab.find('.tool-bar').find('button');
        for(var i=0; i<toolbarButtons.length; i++){
            if($(toolbarButtons[i]).is(":hidden")){
                $(toolbarButtons[i]).show();
            } else {
                $(toolbarButtons[i]).hide();
            }
        }
        var divs = katana.$activeTab.find('#body-div').children();
        for(i=0; i<divs.length; i++){
            if($(divs[i]).is(":hidden")){
                $(divs[i]).show();
            } else {
                $(divs[i]).hide();
            }
        }
    },

    landing: {
        init: function(){
            $.ajax({
                type: 'GET',
                url: 'cases/get_list_of_cases/'
            }).done(function(data){
                katana.jsTreeAPI.createJstree(katana.$activeTab.find('#tree-div'), data.data);
                katana.$activeTab.find('#tree-div').on("select_node.jstree", function (e, data){
                    if (data["node"]["icon"] === "jstree-file") {
                        $.ajax({
                            headers: {
                                'X-CSRFToken': katana.$activeTab.find('.csrf-container').html()
                            },
                            type: 'GET',
                            url: 'cases/get_file/',
                            data: {"path": data["node"]["li_attr"]["data-path"]}
                        }).done(function(data){
                            cases.invert();
                            cases.tvArgs["data"] = data.details;
                            katana.$activeTab.find('#detail-block').treeview(cases.tvArgs);
                            cases.tvArgs["data"] = data.requirements;
                            katana.$activeTab.find('#req-block').treeview(cases.tvArgs);
                            cases.tvArgs["data"] = data.steps;
                            katana.$activeTab.find('#step-block').treeview(cases.tvArgs);
                        });
                    }
                });
            });
        },

        openNewFile: function(){
            $.ajax({
                headers: {
                    'X-CSRFToken': katana.$activeTab.find('.csrf-container').html()
                },
                type: 'GET',
                url: 'cases/get_file/',
                data: {"path": false}
            }).done(function(data){
                cases.invert();
                cases.tvArgs["data"] = data.details;
                katana.$activeTab.find('#detail-block').treeview(cases.tvArgs);
                cases.tvArgs["data"] = data.requirements;
                katana.$activeTab.find('#req-block').treeview(cases.tvArgs);
                cases.tvArgs["data"] = data.steps;
                katana.$activeTab.find('#step-block').treeview(cases.tvArgs);
            });
        },
    },

    caseViewer:  {
        close: function () {
            cases.invert();
        }
    },
};