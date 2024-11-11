require "test_helper"

class LabControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get lab_index_url
    assert_response :success
  end
end
