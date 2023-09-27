let BID_CHECKED = true;

const updateClipboard = (newClip) => {
  navigator.clipboard.writeText(newClip).then(
    function () {
      simpleAlert("Copied successfully.");
    },
    function () {
      simpleAlert("Copy failed.");
    }
  );
};

const simpleAlert = (txt) => {
  $("#copy-result").text(txt);
  $("#copy-result").stop();
  $("#copy-result").fadeIn(1000, () => {
    $("#copy-result").fadeOut(700);
  });
};

const showBids = () => {
  var bid_block = "";
  bids.map((bid, index) => {
    bid_block = $("<div/>")
      .addClass("bid-block")
      .attr("bid-order", index)
      .append($("<h2/>").addClass("bid-title").text(bid.title))
      .append($("<p/>").html(bid.content.join("<br/>")));
    $(".bid-wrap").append(bid_block);
  });
};

const showUrls = () => {
  var url_block = "";
  urls.map((url, index) => {
    var label_wrap = $("<div/>").addClass("url-content");
    url.links.map((link) => {
      label_wrap.append(
        $("<label/>")
          .addClass("url-content-wrap")
          .append(
            $("<input/>").addClass("url-checked").attr("type", "checkbox")
          )
          .append($("<p/>").text(link))
          .append(
            $("<a/>")
              .html("&#8680;")
              .attr("target", "_blank")
              .attr("href", link)
          )
      );
    });
    url_block = $("<div/>")
      .addClass("url-block")
      .append($("<h2/>").addClass("url-title").text(url.title))
      .append(label_wrap);
    $(".url-wrap").append(url_block);
  });
};

const copyEvt = () => {
  var copy_urls = "";
  $(".url-content-wrap").map((index, url_wrap) => {
    let is_url_checked = $(url_wrap).find("input").get(0).checked;
    if (is_url_checked) {
      let copy_url = $(url_wrap).find("p").text();
      copy_urls += "\n" + copy_url;
    }
  });
  if (copy_urls == "") simpleAlert("No selected items.");
  else updateClipboard(copy_urls);
};

const init = () => {
  showBids();
  showUrls();
};

document.addEventListener("keydown", (evt) => {
  if (evt.key === "c" && evt.ctrlKey) {
    copyEvt();
  }
});

$(document).ready(function () {
  init();

  $(".bid-block").click(function () {
    let bid_order = Number($(this).attr("bid-order"));
    updateClipboard(bids[bid_order].content.join("\n"));
  });

  $("#search-input").keyup(function () {
    let keyword = $(this).val().toLowerCase();
    if (keyword) {
      $(".search-wrap").addClass("is-keyword");
    } else {
      $(".search-wrap").removeClass("is-keyword");
    }

    BID_CHECKED = $("#bid-checked").get(0).checked;
    if (BID_CHECKED) {
      $(".bid-block").hide();
      $(".bid-block").map((index, bid_block) => {
        let bid_title = $(bid_block).find(".bid-title").text().toLowerCase();
        if (bid_title.indexOf(keyword) >= 0) {
          $(bid_block).show();
        }
      });
    } else {
      $(".url-block").hide();
      $(".url-block").map((index, url_block) => {
        let url_title = $(url_block).find(".url-title").text().toLowerCase();
        if (url_title.indexOf(keyword) >= 0) {
          $(url_block).show();
        }
      });
    }
  });

  $(".search-cancel").click(() => {
    $("#search-input").val("");
    $(".search-wrap").removeClass("is-keyword");
    $(".bid-block").show();
    $(".url-block").show();
  });

  $("#bid-checked").click(() => {
    $("#search-input").val("");
    $(".bid-block").show();
    $(".url-block").show();
  });

  $("#copy-btn").click(copyEvt);

  $("#unselect-btn").click(() => {
    $(".url-content-wrap>input").map((index, ele) => {
      $(ele).get(0).checked = false;
    });
  });

  $(".url-title").click(function () {
    let same_urls = [];
    $(this)
      .next()
      .find("p")
      .map((index, ele) => {
        same_urls.push($(ele).text());
      });
    updateClipboard(same_urls.join("\n"));
  });
});
